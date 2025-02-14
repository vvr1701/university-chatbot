from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import uvicorn
from openai import OpenAI  # ✅ Correct import
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI API Key
OPENAI_API_KEY = os.getenv("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")
if not OPENAI_API_KEY:
    raise ValueError("❌ Missing OpenAI API key. Set OPENAI_API_KEY in environment variables.")

client = OpenAI(api_key=OPENAI_API_KEY)  # ✅ Initialize OpenAI client

# ✅ User database (Dummy)
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

# ✅ Home route
@app.get("/")
def home():
    return {"message": "🚀 FastAPI chatbot backend is running!"}

# 🔹 LOGIN ROUTE
@app.post("/login")
def login(request: LoginRequest):
    if request.roll_no in USER_DATABASE and USER_DATABASE[request.roll_no] == request.email:
        return {"success": True, "message": "✅ Login successful", "token": f"auth_{request.roll_no}"}
    raise HTTPException(status_code=401, detail="❌ Invalid Roll Number or Email")

# 🔹 CHAT ROUTE (Updated OpenAI API)
@app.post("/chat")
def chat(request: ChatRequest):
    if request.roll_no not in USER_DATABASE:
        raise HTTPException(status_code=401, detail="❌ Unauthorized user")

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": request.question}]
        )
        answer = response.choices[0].message.content  # ✅ Correct way to extract the answer
        return {"answer": answer}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🔴 OpenAI Error: {str(e)}")

# ✅ Run the FastAPI server (For local testing)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
