document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");
    const logoutButton = document.getElementById("logout");

    const API_URL = "https://university-chatbot-tbh3.onrender.com";

    // Function to save login info in local storage
    function saveUserInfo(rollNumber, email) {
        localStorage.setItem("rollNumber", rollNumber);
        localStorage.setItem("email", email);
    }

    // Function to check login status
    function checkLoginStatus() {
        const rollNumber = localStorage.getItem("rollNumber");
        const email = localStorage.getItem("email");
        if (rollNumber && email) {
            document.getElementById("login-section").style.display = "none";
            document.getElementById("chat-section").style.display = "block";
        }
    }

    // Handle login
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const rollNumber = document.getElementById("roll-number").value;
        const email = document.getElementById("email").value;

        if (rollNumber && email) {
            try {
                const response = await fetch(`${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}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ roll_no: rollNumber, email: email }),
                });

                const data = await response.json();
                if (response.ok) {
                    saveUserInfo(rollNumber, email);
                    document.getElementById("login-section").style.display = "none";
                    document.getElementById("chat-section").style.display = "block";
                } else {
                    alert("Login failed: " + data.detail);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    });

    // Handle chat message submission
    chatForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const message = messageInput.value.trim();
        const rollNumber = localStorage.getItem("rollNumber");

        if (message === "" || !rollNumber) return;

        // Show user message
        chatBox.innerHTML += `<div class="user-message">You: ${message}</div>`;

        // Send message to backend
        try {
            const response = await fetch(`${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}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: message, roll_no: rollNumber }),
            });

            const data = await response.json();
            chatBox.innerHTML += `<div class="bot-message">Bot: ${data.answer}</div>`;
        } catch (error) {
            console.error("Error:", error);
            chatBox.innerHTML += `<div class="error-message">Error fetching response</div>`;
        }

        messageInput.value = "";
    });

    // Handle logout
    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("rollNumber");
        localStorage.removeItem("email");
        document.getElementById("login-section").style.display = "block";
        document.getElementById("chat-section").style.display = "none";
    });

    // Check if user is already logged in
    checkLoginStatus();
});
