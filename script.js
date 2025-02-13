document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const chatForm = document.getElementById("chat-form");
    const messageInput = document.getElementById("message");
    const chatBox = document.getElementById("chat-box");
    const logoutButton = document.getElementById("logout");

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
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const rollNumber = document.getElementById("roll-number").value;
        const email = document.getElementById("email").value;

        if (rollNumber && email) {
            saveUserInfo(rollNumber, email);
            document.getElementById("login-section").style.display = "none";
            document.getElementById("chat-section").style.display = "block";
        }
    });

    // Handle chat message submission
    chatForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message === "") return;

        // Show user message
        chatBox.innerHTML += `<div class="user-message">You: ${message}</div>`;

        // Send message to backend
        try {
            const response = await fetch("https://university-chatbot-tbh3.onrender.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ question: message })
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

