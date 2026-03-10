/**
 * AI Service — Google Gemini Integration via @google/generative-ai SDK
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_ID = 'gemini-2.0-flash';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const AVAILABLE_MODELS = [
    {
        id: 'gemini-2.0-flash',
        name: 'Gemini Flash 2.0',
        description: 'Fast, capable AI for coding help',
        provider: 'gemini'
    }
];

/**
 * Serialize codeContext (object or string) to a readable string for the prompt.
 */
function serializeContext(codeContext) {
    if (!codeContext) return '';
    if (typeof codeContext === 'string') return codeContext;
    return `Active File: ${codeContext.activeFile || 'unknown'}
Scenario: ${codeContext.scenario || 'General coding'}
Current Code:
\`\`\`javascript
${codeContext.code || ''}
\`\`\``;
}

/**
 * Send a message to Gemini and get a response.
 * @param {Array} messages - [{role: 'user'|'assistant', content: string}]
 * @param {Object|string|null} codeContext - Current code context
 * @param {string} [modelOverride] - Optional, ignored (always uses Gemini Flash)
 * @returns {Promise<string>}
 */
export async function sendMessage(messages, codeContext = null, modelOverride = null) {
    if (!GEMINI_API_KEY) {
        throw new Error('No Gemini API key found. Add VITE_GEMINI_API_KEY to your .env file.');
    }

    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const contextStr = serializeContext(codeContext);

    const conversation = messages
        .map(m => `${m.role === 'assistant' ? 'assistant' : 'user'}: ${m.content}`)
        .join('\n');

    const prompt = `You are a helpful AI coding assistant inside a coding sandbox platform.
Help users learn by explaining concepts and debugging code.
Be concise, educational, and friendly. DO NOT give the full solution directly.

${contextStr ? `Code Context:\n${contextStr}\n` : ''}
Conversation:
${conversation}

assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

/**
 * Get a quick debugging hint for the current scenario.
 * @param {Object|string|null} codeContext
 * @param {string} [modelOverride] - Ignored, kept for API compatibility
 * @returns {Promise<string>}
 */
export async function getHint(codeContext, modelOverride = null) {
    if (!GEMINI_API_KEY) {
        throw new Error('No Gemini API key found. Add VITE_GEMINI_API_KEY to your .env file.');
    }

    const model = genAI.getGenerativeModel({ model: MODEL_ID });

    const contextStr = serializeContext(codeContext);

    const prompt = `You are a coding assistant. Give a short, helpful debugging hint for this code.
Do NOT give the full solution — only guide the user toward the fix.

${contextStr || 'No code context provided.'}

Hint:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

/**
 * Explain a piece of code.
 * @param {string} code
 * @returns {Promise<string>}
 */
export async function explainCode(code) {
    return sendMessage([{
        role: 'user',
        content: `Please explain this code:\n\`\`\`javascript\n${code}\n\`\`\``
    }]);
}