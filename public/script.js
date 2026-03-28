// Initialize or retrieve session ID
let sessionId = localStorage.getItem("sessionId");
if (!sessionId) {
  sessionId = "session_" + Date.now();
  localStorage.setItem("sessionId", sessionId);
}

async function askAI() {
  const question = document.getElementById("question").value;
  
  if (!question.trim()) {
    alert("Please enter a question");
    return;
  }

  const askBtn = document.getElementById("askBtn");
  const questionInput = document.getElementById("question");
  const responseContainer = document.getElementById("responseContainer");
  const responseDiv = document.getElementById("response");
  
  // Show loading state and disable inputs
  askBtn.disabled = true;
  askBtn.textContent = "Thinking...";
  askBtn.classList.add("loading");
  questionInput.disabled = true;
  responseContainer.classList.add("show");
  
  // Create a loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.innerHTML = '<div class="spinner"></div> Processing your question...';
  responseDiv.appendChild(loadingDiv);

  try {
    const res = await fetch("/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question, sessionId })
    });

    const data = await res.json();
    console.log("Parsed response:", data);

    // Update sessionId in case server returned a new one
    if (data.sessionId) {
      sessionId = data.sessionId;
      localStorage.setItem("sessionId", sessionId);
    }

    const answer = data.answer || "No response from AI";
    console.log("ANSWER:", answer);

    // Remove loading indicator
    loadingDiv.remove();

    // Create a container for this Q&A pair
    const qaContainer = document.createElement("div");
    qaContainer.style.cssText = "margin-bottom: 25px; padding-bottom: 25px; border-bottom: 2px solid #f0f0f0;";
    
    const questionDisplay = `<div style="background: #f0f0f0; padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #667eea;"><strong style="color: #667eea;">Your Question:</strong><br>${question}</div>`;
    qaContainer.innerHTML = questionDisplay + marked.parse(answer);
    
    // Append the new Q&A to the response div
    responseDiv.appendChild(qaContainer);
    responseContainer.classList.add("show");
    
    // Scroll to the new response
    setTimeout(() => {
      qaContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  } catch (error) {
    console.error("Error:", error);
    loadingDiv.remove();
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = '<strong style="color: red;">Error:</strong> Unable to get response from AI. Please try again.';
    responseDiv.appendChild(errorDiv);
  } finally {
    // Restore button state but keep textarea disabled
    askBtn.disabled = false;
    askBtn.textContent = "Send Question";
    askBtn.classList.remove("loading");
  }
}

// Function to enable new question
function newQuestion() {
  const questionInput = document.getElementById("question");
  
  questionInput.disabled = false;
  questionInput.value = "";
  questionInput.focus();
}

// Allow sending question with Enter key
document.addEventListener("DOMContentLoaded", function() {
  const questionInput = document.getElementById("question");
  if (questionInput) {
    questionInput.addEventListener("keypress", function(event) {
      if (event.key === "Enter" && event.ctrlKey) {
        askAI();
      }
    });
  }
});