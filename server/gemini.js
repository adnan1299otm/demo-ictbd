const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function askGemini(systemContext, userMessage) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
You are ICT Bangladesh official AI assistant.
Only answer using the provided knowledge.
If the answer is not found, say:
"This information is not available at the moment."

KNOWLEDGE:
${systemContext}

USER QUESTION:
${userMessage}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { askGemini };
