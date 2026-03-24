async function askAI() {
  const question = document.getElementById("question").value;

  const res = await fetch("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  });

const data = await res.json();
  console.log("Parsed response:", data);

  const answer = data.answer || "No response from AI";

      // console.log("ANSWER:", answer);

  document.getElementById("response").innerHTML = marked.parse(answer);
}