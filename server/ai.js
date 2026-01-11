const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getKnowledgeContext } = require('./knowledge');

// Production AI Response Rules
const SYSTEM_INSTRUCTION = `
You are the official AI Assistant for ICT Bangladesh.

CRITICAL RULES:
1. Answer ONLY from the provided ICT Bangladesh knowledge base below.
2. Do NOT use external knowledge or make assumptions.
3. If information is not in the knowledge base, respond with: "This information is not available at the moment."
4. If the user asks about topics outside ICT Bangladesh (courses, admissions, services), politely redirect:
   "I can only assist with ICT Bangladesh courses, admissions, and services. How may I help you with that?"
5. If you cannot help or the user explicitly requests human support, respond with "NEEDS_HUMAN".
6. If the user is inappropriate or abusive, immediately respond with "NEEDS_HUMAN".

TONE:
- Professional
- Helpful
- Educational
- Institutional (you represent an educational institute)

ICT BANGLADESH KNOWLEDGE BASE:
{KNOWLEDGE_CONTEXT}

Remember: Only use information from the knowledge base above. Do not invent or assume details.
`;

const genAI = new GoogleGenerativeAI("AIzaSyCM90e8LR16pGIerfmbhLd3f7vugA-d8xo");

async function getAIResponse(history, newMessage) {
    try {
        // Get current knowledge context
        const knowledgeContext = getKnowledgeContext();

        // Build system instruction with knowledge
        const instruction = SYSTEM_INSTRUCTION.replace('{KNOWLEDGE_CONTEXT}', knowledgeContext);

        // Create model with updated instruction
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            systemInstruction: instruction
        });

        // Construct chat history for Gemini
        const chatHistory = history.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(newMessage);
        const response = result.response;
        let text = response.text();

        // Check for needs_human flag
        let needsHuman = false;

        if (text.includes("NEEDS_HUMAN")) {
            needsHuman = true;
            text = "I am connecting you to a human support agent who can better assist you. Please wait a moment.";
        }

        return { text, needsHuman };

    } catch (error) {
        console.error("AI Error:", error);
        return {
            text: "I am having trouble processing your request right now. I have notified support.",
            needsHuman: true
        };
    }
}

async function summarizeConversation(messages) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const historyText = messages.map(m => `${m.sender}: ${m.content}`).join("\\n");
        const prompt = `Summarize this conversation in 1-2 sentences:\\n\\n${historyText}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch {
        return "Summary unavailable.";
    }
}

module.exports = { getAIResponse, summarizeConversation };
