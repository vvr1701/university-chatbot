const backendUrl = "https://university-chatbot-tbh3.onrender.com";  // Your FastAPI backend

// Login function
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
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("loginError").textContent = "Server error. Try again!";
    });
}

// Chat function
function askQuestion() {
    const question = document.getElementById("question").value;
    const chatBox = document.getElementById("chatBox");

    if (!question.trim()) return;  // Prevent empty messages

    chatBox.innerHTML += `<div class="user-question">You: ${question}</div>`;
    document.getElementById("question").value = "";

    // Show loading message
    chatBox.innerHTML += `<div class="bot-response" id="loading">Bot: Typing...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("loading").remove();  // Remove "Typing..." message
        chatBox.innerHTML += `<div class="bot-response">Bot: ${data.response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("loading").innerHTML = "Bot: Error fetching response.";
    });
}

// Logout function
function logout() {
    document.getElementById("chatPage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
}
