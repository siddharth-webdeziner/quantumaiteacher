import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

// Store conversation history
const conversationHistory = {};

app.post("/ask", async (req, res) => {
  try {
    const SYSTEM_INSTRUCTION = {
        parts: [{ text: "You are a helpful assistant. Always respond in English only, regardless of the language used in the question. Remember previous questions asked in this conversation and use that context to answer related questions. If a new question is related to a previous one, refer to the previous answer and build upon it." }]
    };
    const question = req.body.question;
    const sessionId = req.body.sessionId || "default";

    // Initialize session history if not exists
    if (!conversationHistory[sessionId]) {
      conversationHistory[sessionId] = [];
    }

    // Build conversation context
    const conversationContext = conversationHistory[sessionId]
      .map(msg => `Q: ${msg.question}\nA: ${msg.answer}`)
      .join("\n\n");

    const fullContext = conversationContext 
      ? `Previous conversation:\n${conversationContext}\n\nCurrent question: ${question}`
      : question;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
            system_instruction: SYSTEM_INSTRUCTION,
          contents: [
            {
              parts: [
                {
                  text: SYSTEM_INSTRUCTION.parts[0].text + "\n\n" + fullContext
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("STATUS:", response.status);
    console.log("FULL DATA:", JSON.stringify(data, null, 2));

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    // Store this Q&A pair in conversation history
    conversationHistory[sessionId].push({
      question: question,
      answer: answer
    });

    res.json({ answer, sessionId });

  } catch (err) {
    console.error(err);
    res.send("Error connecting to AI");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));