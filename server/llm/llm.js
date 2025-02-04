import { GoogleGenerativeAI } from '@google/generative-ai';

// the google key
const genAI = new GoogleGenerativeAI('');

export async function executeLlmPrompt(prompt) {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp'
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text;
}
