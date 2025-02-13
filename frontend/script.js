const backendUrl = "https://university-chatbot-tbh3.onrender.com";

function login() {
    const rollNo = document.getElementById("rollNo").value;
    const email = document.getElementById("email").value;

    fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roll_no: rollNo, email: email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("chatPage").classList.remove("hidden");
        } else {
            document.getElementById("loginError").textContent = "Invalid credentials!";
        }
    })
    .catch(error => console.error("Error:", error));
}

function askQuestion() {
    const question = document.getElementById("question").value;
    const chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `<div class="user-question">You: ${question}</div>`;
    
    fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => {
        chatBox.innerHTML += `<div class="bot-response">Bot: ${data.response}</div>`;
        document.getElementById("question").value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => console.error("Error:", error));
}

function logout() {
    document.getElementById("chatPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}
