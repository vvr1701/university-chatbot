from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import os
import uvicorn
import openai
from fastapi.middleware.cors import CORSMiddleware

# OpenAI API Key
openai.api_key = "YOUR_OPENAI_API_KEY"

app = FastAPI()

# Enable CORS (Frontend-Backend Communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for security in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database of users
users_db = {
    "2320030282": {"email": "vishnuvardhan1701@gmail.com"},
    "12345": {"email": "student1@example.com"},
    "67890": {"email": "student2@example.com"},
}

# Request models
class LoginRequest(BaseModel):
    roll_no: str
    email: str

class ChatRequest(BaseModel):
    question: str
    roll_no: str

@app.get("/")
def home():
    return {"message": "FastAPI is working with ChatGPT!"}

@app.post("/login")
def login(user: LoginRequest):
    """Authenticate user based on roll number and email."""
    if user.roll_no in users_db and users_db[user.roll_no]["email"] == user.email:
        return {"message": "Login successful", "roll_no": user.roll_no}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/chat")
def chat(request: ChatRequest):
    """Handle chat request and fetch response from OpenAI's ChatGPT."""
    if request.roll_no not in users_db:
        raise HTTPException(status_code=403, detail="Unauthorized user")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.question}]
        )
        chat_reply = response["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error contacting OpenAI: {str(e)}")

    return {"answer": chat_reply}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Use Render's assigned PORT or default
    uvicorn.run(app, host="0.0.0.0", port=port)
