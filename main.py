from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import uvicorn
import openai
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (Required for frontend to work)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend to access backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API Key (Set this in Render environment variables)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("❌ Missing OpenAI API key. Set OPENAI_API_KEY in environment variables.")

openai.api_key = OPENAI_API_KEY  # Initialize OpenAI API key

# ✅ Simulated user database (Replace with a real database)
USER_DATABASE = {
    "2320030282": "vishnuvardhan1701@gmail.com",
    "2320030271": "2320030271@klh.edu.in"
}

# ✅ Request models
class LoginRequest(BaseModel):
    roll_no: str
    email: str

class ChatRequest(BaseModel):
    roll_no: str
    question: str

# ✅ Home route (Check if API is working)
@app.get("/")
def home():
    return {"message": "🚀 FastAPI chatbot backend is running!"}

# 🔹 LOGIN ROUTE
@app.post("/login")
def login(request: LoginRequest):
    if request.roll_no in USER_DATABASE and USER_DATABASE[request.roll_no] == request.email:
        return {"success": True, "message": "✅ Login successful", "token": f"auth_{request.roll_no}"}
    raise HTTPException(status_code=401, detail="❌ Invalid Roll Number or Email")

# 🔹 CHAT ROUTE (Requires valid roll number)
@app.post("/chat")
def chat(request: ChatRequest):
    if request.roll_no not in USER_DATABASE:
        raise HTTPException(status_code=401, detail="❌ Unauthorized user")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.question}]
        )
        answer = response["choices"][0]["message"]["content"]
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🔴 OpenAI Error: {str(e)}")

# ✅ Run the FastAPI server (For local testing)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
