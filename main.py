from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import uvicorn
import together  # ✅ Import Together.AI
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

# ✅ Together AI API Key
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
if not TOGETHER_API_KEY:
    raise ValueError("❌ Missing Together AI API key. Set TOGETHER_API_KEY in environment variables.")

together.api_key = TOGETHER_API_KEY  # ✅ Initialize Together AI

# ✅ Dummy user database
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
    return {"message": "🚀 FastAPI chatbot backend is running with LLaMA!"}

# 🔹 LOGIN ROUTE
@app.post("/login")
def login(request: LoginRequest):
    if request.roll_no in USER_DATABASE and USER_DATABASE[request.roll_no] == request.email:
        return {"success": True, "message": "✅ Login successful", "token": f"auth_{request.roll_no}"}
    raise HTTPException(status_code=401, detail="❌ Invalid Roll Number or Email")

# 🔹 CHAT ROUTE (Using LLaMA via Together.AI)
@app.post("/chat")
def chat(request: ChatRequest):
    if request.roll_no not in USER_DATABASE:
        raise HTTPException(status_code=401, detail="❌ Unauthorized user")

    try:
        response = together.Complete.create(
            prompt=request.question,
            model="meta-llama/Llama-2-7b-chat-hf",
            max_tokens=200
        )

        # ✅ Check correct response structure
        if "choices" in response and len(response["choices"]) > 0:
            answer = response["choices"][0]["text"].strip()
            return {"answer": answer}
        else:
            raise HTTPException(status_code=500, detail="🔴 LLaMA API Error: Unexpected response format")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"🔴 LLaMA API Error: {str(e)}")


# ✅ Run the FastAPI server (For local testing)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run(app, host="0.0.0.0", port=port)
