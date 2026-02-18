/**
 * AI Service for Google Gemini Integration
 * Handles all AI-related API calls for the chat assistant
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-1.5-flash'; // Free tier model

/**
 * Send a message to Gemini and get a response
 * @param {Array} messages - Array of message objects {role: 'user'|'assistant', content: string}
 * @param {Object} codeContext - Current code context {activeFile, code, scenario}
 * @returns {Promise<string>} - AI response text
 */
export const sendMessage = async (messages, codeContext = null) => {
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

        // Convert messages to Gemini format
        const geminiMessages = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const API_URL = `${API_BASE_URL}/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: geminiMessages,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `API Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response from Gemini API');
        }

        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('AI Service Error:', error);

        // Handle specific error cases
        if (error.message.includes('API key') || error.message.includes('401')) {
            throw new Error('AI service not configured. Please add your Gemini API key to .env file as VITE_GEMINI_API_KEY. Get a free key at https://aistudio.google.com/app/apikey');
        }

        throw new Error(`Failed to get AI response: ${error.message}`);
    }
};

/**
 * Get a quick hint for the current scenario
 * @param {Object} codeContext - Current code context
 * @returns {Promise<string>} - AI hint
 */
export const getHint = async (codeContext) => {
    const messages = [{
        role: 'user',
        content: 'Can you give me a hint about what I should focus on to solve this scenario? Don\'t give me the complete solution, just point me in the right direction.'
    }];

    return sendMessage(messages, codeContext);
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
