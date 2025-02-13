from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import os
import uvicorn

app = FastAPI()

# Mock user database
users_db = {"12345": {"email": "student1@example.com"}, "67890": {"email": "student2@example.com"}}

# Sample question-answer dataset
responses: Dict[str, str] = {
    "What is an operating system?": "An OS is software that manages hardware and software resources.",
    "What is memory management?": "Memory management handles allocation and deallocation of memory in a system.",
    "Define virtual memory.": "Virtual memory allows a process to use more memory than physically available by using disk storage."
}

class LoginRequest(BaseModel):
    roll_no: str
    email: str

class ChatRequest(BaseModel):
    question: str
    roll_no: str

@app.post("/login")
def login(user: LoginRequest):
    if user.roll_no in users_db and users_db[user.roll_no]["email"] == user.email:
        return {"message": "Login successful", "roll_no": user.roll_no}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/chat")
def chat(request: ChatRequest):
    answer = responses.get(request.question, "I'm still learning. Please check the syllabus.")
    return {"answer": answer}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))  # Default to 10000 if PORT is not set
    uvicorn.run(app, host="0.0.0.0", port=port)
