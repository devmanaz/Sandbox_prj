/**
 * AI Service for Google Gemini Integration
 * Handles all AI-related API calls for the chat assistant
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const PRIMARY_MODEL = 'gemini-1.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

/**
 * List of available models for the user to choose from
 */
export const AVAILABLE_MODELS = [
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient for most tasks' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Maximum intelligence for complex code' },
    { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Preview)', description: 'Next-gen performance and speed' }
];

/**
 * Send a message to Gemini and get a response
 * @param {Array} messages - Array of message objects {role: 'user'|'assistant', content: string}
 * @param {Object} codeContext - Current code context {activeFile, code, scenario}
 * @param {string} modelOverride - Optional model to use
 * @returns {Promise<string>} - AI response text
 */
export const sendMessage = async (messages, codeContext = null, modelOverride = null) => {
    let currentModel = modelOverride || PRIMARY_MODEL;
    try {
        // Build system instruction with code context
        let systemInstruction = `You are a helpful AI coding assistant integrated into a coding sandbox platform. 
You help users learn programming by answering questions, explaining code, debugging issues, and providing guidance.
Be concise, friendly, and educational. Focus on helping users understand concepts rather than just giving answers.`;

        if (codeContext) {
            systemInstruction += `\n\nCurrent Coding Context:
- Active File: ${codeContext.activeFile}
- Scenario: ${codeContext.scenario || 'General coding practice'}
- Current Code:
\`\`\`javascript
${codeContext.code}
\`\`\`

Use this context to provide relevant, specific help.`;
        }

        // Convert messages to Gemini format and handle system instruction
        let firstUserMessage = true;
        const geminiMessages = messages.map(msg => {
            let role = msg.role === 'assistant' ? 'model' : 'user';
            let content = msg.content;

            // Prepend system instruction to the first user message for stability in v1
            if (firstUserMessage && role === 'user') {
                content = `${systemInstruction}\n\n${content}`;
                firstUserMessage = false;
            }

            return {
                role: role,
                parts: [{ text: content }]
            };
        });

        // If no user message was found to prepend to, add a new one (should not happen)
        if (firstUserMessage) {
            geminiMessages.unshift({
                role: 'user',
                parts: [{ text: systemInstruction }]
            });
        }

        const API_URL = `${API_BASE_URL}/${currentModel}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: geminiMessages,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            const message = error.error?.message || `API Error: ${response.status}`;

            // If we hit a quota on primary, try fallback once
            if (response.status === 429 && currentModel === PRIMARY_MODEL) {
                console.warn('Primary model quota exceeded, trying fallback...');
                return sendMessage(messages, codeContext, FALLBACK_MODEL);
            }

            throw new Error(message);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from Gemini API');
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('AI Service Error:', error);

        // Handle specific error cases
        if (error.message.includes('quota') || error.message.includes('429')) {
            throw new Error('You exceeded your current AI quota. This happens on free keys after several quick messages. Please wait 1-2 minutes and try again.');
        }

        if (error.message.includes('API key') || error.message.includes('401')) {
            throw new Error('AI service not configured correctly. Please check your VITE_GEMINI_API_KEY in the .env file.');
        }

        throw new Error(`Failed to get AI response: ${error.message}`);
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
