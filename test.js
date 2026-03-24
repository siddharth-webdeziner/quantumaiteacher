// test.js - Google Gemini FREE API (no npm install needed)
// Uses built-in fetch — requires Node.js 18+
// Get free API key: https://aistudio.google.com/app/apikey

const API_KEY  = "AIzaSyB6g-8SFGKT7_U43KExMMwmguqy9rXqnb4"; // Replace with your free key
const MODEL    = "gemini-2.5-flash";     // Free tier model (latest)
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// ─── Helper: Send request to Gemini ──────────────────────────
async function ask(messages, config = {}) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: messages,
      generationConfig: {
        temperature: config.temperature ?? 0.7,
        maxOutputTokens: config.maxTokens ?? 512,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Request failed");
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response";
}

// ─── Test 1: Simple Question ──────────────────────────────────
async function testSimple() {
  console.log("\n🔹 Test 1: Simple Question");
  console.log("───────────────────────────");
  const prompt = "What is Node.js in one sentence?";
  const reply = await ask([{ role: "user", parts: [{ text: prompt }] }]);
  console.log("Q:", prompt);
  console.log("A:", reply);
}

// ─── Test 2: Multi-turn Chat ──────────────────────────────────
async function testChat() {
  console.log("\n🔹 Test 2: Multi-turn Chat");
  console.log("───────────────────────────");
  const history = [
    { role: "user",  parts: [{ text: "My name is Alex." }] },
    { role: "model", parts: [{ text: "Hello Alex! Nice to meet you." }] },
    { role: "user",  parts: [{ text: "What is my name?" }] },
  ];
  const reply = await ask(history);
  console.log("User  : What is my name?");
  console.log("Gemini:", reply);
}

// ─── Test 3: Code Generation ──────────────────────────────────
async function testCode() {
  console.log("\n🔹 Test 3: Code Generation");
  console.log("───────────────────────────");
  const prompt = "Write a JavaScript function to reverse a string.";
  const reply = await ask([{ role: "user", parts: [{ text: prompt }] }]);
  console.log("Q:", prompt);
  console.log("A:\n", reply);
}

// ─── Test 4: Creative Writing ─────────────────────────────────
async function testCreative() {
  console.log("\n🔹 Test 4: Creative Writing");
  console.log("────────────────────────────");
  const prompt = "Write a 2-line poem about the moon.";
  const reply = await ask(
    [{ role: "user", parts: [{ text: prompt }] }],
    { temperature: 1.0 }
  );
  console.log("Q:", prompt);
  console.log("A:", reply);
}

// ─── Test 5: Summarization ────────────────────────────────────
async function testSummary() {
  console.log("\n🔹 Test 5: Summarization");
  console.log("─────────────────────────");
  const text = `
    Artificial Intelligence (AI) is the simulation of human intelligence in machines.
    It includes learning, reasoning, and self-correction. AI is used in healthcare,
    finance, education, and many other fields. Machine learning and deep learning
    are subsets of AI that allow computers to learn from data.
  `;
  const prompt = `Summarize this in one sentence:\n${text}`;
  const reply = await ask([{ role: "user", parts: [{ text: prompt }] }]);
  console.log("Q: Summarize the given paragraph");
  console.log("A:", reply);
}

// ─── Run All Tests ────────────────────────────────────────────
async function main() {
  console.log("🚀 Google Gemini FREE API - Test Suite");
  console.log("========================================");
  console.log("Model :", MODEL);
  console.log("Docs  : https://ai.google.dev/gemini-api/docs");

  try {
    await testSimple();
    await testChat();
    await testCode();
    await testCreative();
    await testSummary();
    console.log("\n✅ All tests passed!");
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    if (err.message.includes("API_KEY") || err.message.includes("key")) {
      console.error("👉 Get your free key at: https://aistudio.google.com/app/apikey");
      console.error("👉 Replace YOUR_GEMINI_API_KEY in this file with your actual key.");
    }
  }
}

main();