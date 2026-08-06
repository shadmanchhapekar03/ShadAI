from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
from shadai import ShadAI

class ChatRequest(BaseModel):
    question: str


app = FastAPI()


@app.get("/")
def default():
    return {
        "message": "Hello this is ShadAI"
    }

@app.post("/chat")
def chat(request: ChatRequest):
    resume_text = ShadAI.read_pdf(Path("Shadman_Chhapekar_Resume.pdf"))
    resume = ShadAI.parse_resume(resume_text)
    answer = ShadAI.ask_candidate(request.question,resume)
    return {
        "message": answer
    }