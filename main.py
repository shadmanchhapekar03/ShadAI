from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
from shadai import ShadAI
from fastapi.middleware.cors import CORSMiddleware

class ChatRequest(BaseModel):
    question: str

origins = [
    "https://shad-ai-phi.vercel.app"
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allowed origins
    allow_credentials=True,           # Allow cookies/auth headers
    allow_methods=["*"],               # Allowed HTTP methods
    allow_headers=["*"],               # Allowed HTTP headers
)

@app.get("/")
def default():
    return {
        "message": "Hello this is ShadAI"
    }

@app.post("/chat")
def chat(request: ChatRequest):
    resume_text = ShadAI.read_pdf(Path("Shadman_Chhapekar_Resume_AI_Engineer_.pdf"))
    resume = ShadAI.parse_resume(resume_text)
    answer = ShadAI.ask_candidate(request.question,resume)
    return {
        "message": answer
    }
