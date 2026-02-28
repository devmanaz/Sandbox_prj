/**
 * AI Service for Google Gemini Integration
 * Handles all AI-related API calls for the chat assistant
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const OLLAMA_BASE_URL = 'http://localhost:11434/api';

const PRIMARY_MODEL = 'gemma3:1b';
const FALLBACK_MODEL = 'gemma3:1b';

import { retrieveContext } from './ragService';

/**
 * List of available models for the user to choose from
 */
export const AVAILABLE_MODELS = [
    { id: 'gemma3:1b', name: 'Gemma 3 1B (Local)', description: 'Fast local Google model', provider: 'ollama' },
    { id: 'llama3', name: 'Llama 3 (Local)', description: 'Powerful local model (needs pull)', provider: 'ollama' },
    { id: 'mistral', name: 'Mistral (Local)', description: 'Balanced performance (needs pull)', provider: 'ollama' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast cloud-based AI', provider: 'gemini' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Maximum intelligence for complex tasks', provider: 'gemini' }
];

/**
 * Send a message to Gemini and get a response
 * @param {Array} messages - Array of message objects {role: 'user'|'assistant', content: string}
 * @param {Object} codeContext - Current code context {activeFile, code, scenario}
 * @param {string} modelOverride - Optional model to use
 * @returns {Promise<string>} - AI response text
 */
export const sendMessage = async (messages, codeContext = null, modelOverride = null) => {
    let currentModelId = modelOverride || PRIMARY_MODEL;
    const modelConfig = AVAILABLE_MODELS.find(m => m.id === currentModelId) || AVAILABLE_MODELS[0];

    // Build system instruction with code context
    let systemInstruction = `You are a helpful AI coding assistant integrated into a coding sandbox platform. 
You help users learn programming by answering questions, explaining code, debugging issues, and providing guidance.
Be concise, friendly, and educational. Focus on helping users understand concepts rather than just giving answers.`;

    // RAG: Retrieve relevant context from knowledge base (Scenarios, Wikipedia, Project)
    const userQuery = messages[messages.length - 1]?.content || "";
    if (userQuery) {
        try {
            const ragContext = await retrieveContext(userQuery);
            if (ragContext) {
                systemInstruction += ragContext;
            }
        } catch (error) {
            console.error("RAG Error:", error);
        }
    }

    if (codeContext) {
        systemInstruction += `\n\n- Active File: ${codeContext.activeFile}
- Scenario: ${codeContext.scenario || 'General coding practice'}
- Current Code:
\`\`\`javascript
${codeContext.code}
\`\`\`

Use this context to provide relevant, specific help.`;
    }

    if (modelConfig.provider === 'ollama') {
        return sendOllamaRequest(messages, systemInstruction, modelConfig.id);
    } else {
        return sendGeminiRequest(messages, systemInstruction, modelConfig.id);
    }
};

/**
 * Handle Gemini Specific API Request
 */
const sendGeminiRequest = async (messages, systemInstruction, modelId) => {
    try {
        let firstUserMessage = true;
        const geminiMessages = messages.map(msg => {
            let role = msg.role === 'assistant' ? 'model' : 'user';
            let content = msg.content;

            if (firstUserMessage && role === 'user') {
                content = `${systemInstruction}\n\n${content}`;
                firstUserMessage = false;
            }

            return {
                role: role,
                parts: [{ text: content }]
            };
        });

        if (firstUserMessage) {
            geminiMessages.unshift({
                role: 'user',
                parts: [{ text: systemInstruction }]
            });
        }

        const API_URL = `${GEMINI_BASE_URL}/${modelId}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: geminiMessages,
                generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            const message = error.error?.message || `API Error: ${response.status}`;

            if (response.status === 429 && modelId === PRIMARY_MODEL) {
                console.warn('Primary model quota exceeded, trying fallback...');
                return sendGeminiRequest(messages, systemInstruction, FALLBACK_MODEL);
            }
            throw new Error(message);
        }

        const data = await response.json();
        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from Gemini API');
        }

        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        if (error.message.includes('quota') || error.message.includes('429')) {
            throw new Error('You exceeded your current AI quota. Please wait 1-2 minutes.');
        }
        throw error;
    }
};

/**
 * Handle Ollama Specific API Request
 */
const sendOllamaRequest = async (messages, systemInstruction, modelId) => {
    try {
        const ollamaMessages = [
            { role: 'system', content: systemInstruction },
            ...messages
        ];

        const response = await fetch(`${OLLAMA_BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: modelId,
                messages: ollamaMessages,
                stream: false,
                options: { temperature: 0.7 }
            })
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Ollama Error 404: Model "${modelId}" not found. Please run "ollama pull ${modelId}" in your terminal.`);
            }
            throw new Error(`Ollama Error: ${response.status}. Is Ollama running?`);
        }

        const data = await response.json();
        return data.message.content;
    } catch (error) {
        console.error('Ollama Service Error:', error);
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Could not connect to Ollama. Please ensure Ollama is running at http://localhost:11434');
        }
        throw new Error(`Ollama request failed: ${error.message}`);
    }
};

/**
 * Get a quick hint for the current scenario
 * @param {Object} codeContext - Current code context
 * @returns {Promise<string>} - AI hint
 */
export const getHint = async (codeContext, modelOverride = null) => {
    const messages = [{
        role: 'user',
        content: 'Can you give me a hint about what I should focus on to solve this scenario? Don\'t give me the complete solution, just point me in the right direction.'
    }];

    return sendMessage(messages, codeContext, modelOverride);
};

/**
 * Explain a piece of code
 * @param {string} code - Code to explain
 * @returns {Promise<string>} - Explanation
 */
export const explainCode = async (code) => {
    const messages = [{
        role: 'user',
        content: `Please explain this code:\n\`\`\`javascript\n${code}\n\`\`\``
    }];

    return sendMessage(messages);
};
