document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");
    const logoutButton = document.getElementById("logout");

    const API_URL = "https://university-chatbot-tbh3.onrender.com"; // ✅ Backend URL

    // Save user info in local storage
    function saveUserInfo(rollNumber, email) {
        localStorage.setItem("rollNumber", rollNumber);
        localStorage.setItem("email", email);
    }

    // Check login status
    function checkLoginStatus() {
        const rollNumber = localStorage.getItem("rollNumber");
        if (rollNumber) {
            document.getElementById("login-section").style.display = "none";
            document.getElementById("chat-section").style.display = "block";
        }
    }

    // Handle Login
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const rollNumber = document.getElementById("roll-number").value.trim();
        const email = document.getElementById("email").value.trim();

        if (!rollNumber || !email) {
            alert("Please enter both Roll Number and Email.");
            return;
        }

        try {
            console.log("📌 Sending login request...");
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roll_no: rollNumber, email: email }),
            });

            const data = await response.json();
            console.log("✅ Login Response:", data);

            if (response.status === 200 && data.success) {
                saveUserInfo(rollNumber, email);
                document.getElementById("login-section").style.display = "none";
                document.getElementById("chat-section").style.display = "block";
            } else {
                alert("❌ Login failed: " + (data.detail || "Invalid credentials"));
            }
        } catch (error) {
            console.error("🚨 Network Error:", error);
            alert("❌ Unable to connect to the server. Please try again later.");
        }
    });

    // Handle Chat Submission
    chatForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const message = messageInput.value.trim();
        const rollNumber = localStorage.getItem("rollNumber");

        if (!message || !rollNumber) return;

        // Show user message & loading indicator
        chatBox.innerHTML += `<div class="user-message">You: ${message}</div>`;
        const loadingMessage = document.createElement("div");
        loadingMessage.className = "loading-message";
        loadingMessage.innerText = "Bot is typing...";
        chatBox.appendChild(loadingMessage);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll

        try {
            console.log("📌 Sending chat request...");
            const response = await fetch(`${API_URL}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roll_no: rollNumber, question: message }),
            });

            const data = await response.json();
            console.log("✅ Chat Response:", data);

            // Remove loading message
            if (loadingMessage) loadingMessage.remove();

            if (response.status === 200) {
                chatBox.innerHTML += `<div class="bot-message">Bot: ${data.answer}</div>`;
            } else {
                chatBox.innerHTML += `<div class="error-message">Error: ${data.detail}</div>`;
            }
        } catch (error) {
            console.error("🚨 Network Error:", error);
            chatBox.innerHTML += `<div class="error-message">❌ Error fetching response</div>`;
        }

        messageInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    });

    // Handle Logout
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("rollNumber");
        localStorage.removeItem("email");
        document.getElementById("login-section").style.display = "block";
        document.getElementById("chat-section").style.display = "none";
    });

    // Check login status on page load
    checkLoginStatus();
});
