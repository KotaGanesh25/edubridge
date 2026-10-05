const fs = require("fs");
const path = require("path");

const {
  ChatGoogleGenerativeAI,
} = require("@langchain/google-genai");

const knowledgeBasePath = path.join(
  __dirname,
  "../../knowledge-base/edubridge-knowledge.txt"
);

const getKnowledgeBase = () => {
  try {
    if (!fs.existsSync(knowledgeBasePath)) {
      return "";
    }

    return fs.readFileSync(
      knowledgeBasePath,
      "utf-8"
    );
  } catch (error) {
    console.error(
      "Knowledge base error:",
      error.message
    );

    return "";
  }
};

// Simple keyword-based retrieval
const retrieveRelevantContext = (question) => {
  const knowledgeBase =
    getKnowledgeBase();

  if (!knowledgeBase) {
    return "";
  }

  const questionWords = question
    .toLowerCase()
    .split(/\s+/)
    .filter(
      (word) => word.length > 2
    );

  const sections = knowledgeBase
    .split(/\n(?=[A-Z][A-Z\s().-]+\n)/);

  const scoredSections = sections.map(
    (section) => {
      const lowerSection =
        section.toLowerCase();

      let score = 0;

      questionWords.forEach(
        (word) => {
          if (
            lowerSection.includes(word)
          ) {
            score++;
          }
        }
      );

      return {
        section,
        score,
      };
    }
  );

  return scoredSections
    .filter((item) => item.score > 0)
    .sort(
      (a, b) => b.score - a.score
    )
    .slice(0, 4)
    .map((item) => item.section)
    .join("\n\n");
};

const generateAnswer = async (
  question,
  chatHistory = []
) => {
  const context =
    retrieveRelevantContext(
      question
    );

  const model =
    new ChatGoogleGenerativeAI({
      apiKey:
        process.env.GEMINI_API_KEY,
      model:
        "gemini-3.8-flash",
      temperature: 0.2,
    });

  const historyText =
    chatHistory
      .slice(-6)
      .map(
        (message) =>
          `${message.role}: ${message.content}`
      )
      .join("\n");

  const prompt = `
You are EduBridge AI, an educational assistant.

Answer the student's question clearly
and in a beginner-friendly way.

Use the provided knowledge base whenever
the question relates to EduBridge topics.

Do not invent information that is not
supported by the context.

If the knowledge base does not contain
enough information, say that clearly and
then provide a general explanation if
appropriate.

KNOWLEDGE BASE CONTEXT:
${context || "No relevant context found."}

RECENT CHAT HISTORY:
${historyText || "No previous messages."}

STUDENT QUESTION:
${question}

Give a clear and useful answer.
`;

  const response =
    await model.invoke(prompt);

  return response.content;
};

module.exports = {
  retrieveRelevantContext,
  generateAnswer,
};