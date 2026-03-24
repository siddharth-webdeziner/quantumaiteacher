import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/ask", async (req, res) => {
  try {
    const SYSTEM_INSTRUCTION = {
        parts: [{ text: "You are a helpful assistant. Always respond in English only, regardless of the language used in the question." }]
    };
    const question = req.body.question;

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
                  text: SYSTEM_INSTRUCTION.parts[0].text + "\n\nQuestion: " + question
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

    res.json({ answer });

  } catch (err) {
    console.error(err);
    res.send("Error connecting to AI");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));