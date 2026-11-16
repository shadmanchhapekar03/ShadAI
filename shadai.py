from openai import OpenAI
from pydantic import BaseModel, field_validator
from pypdf import PdfReader
from dotenv import load_dotenv
import json
from time import sleep
import os

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=GROQ_API_KEY
)

model = "openai/gpt-oss-120b"

class Experience(BaseModel):
    company: str | None = None
    role: str | None = None
    duration: str | None = None
    description: str | None = None
    skills_used: list[str] = []

class Resume(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None

    total_experience_years: float | None = None

    skills: list[str] = []
    experiences: list[Experience] = []
    education: list[str] = []
    projects: list[str] = []
    certifications: list[str] = []

    @field_validator("education", "projects", "certifications", "skills", mode="before")
    @classmethod
    def stringify_list_items(cls, v):
        if not isinstance(v, list):
            return v
        normalized = []
        for item in v:
            if isinstance(item, str):
                normalized.append(item)
            elif isinstance(item, dict):
                if "name" in item:
                    name = item.get("name")
                    duration = item.get("duration") or item.get("date") or item.get("year")
                    if name:
                        normalized.append(f"{name} — {duration}" if duration else str(name))
                elif item.get("title"):
                    normalized.append(str(item["title"]))
                elif item.get("certification"):
                    normalized.append(str(item["certification"]))
                elif item.get("project"):
                    normalized.append(str(item["project"]))
                else:
                    normalized.append(str(item))
            else:
                normalized.append(str(item))
        return normalized

    @field_validator("experiences", mode="before")
    @classmethod
    def ensure_experiences_list(cls, v):
        if not isinstance(v, list):
            return []
        cleaned = []
        for item in v:
            if not isinstance(item, dict):
                continue
            for key in ("description", "company", "role", "duration"):
                if isinstance(item.get(key), dict):
                    item[key] = str(item[key])
            if not isinstance(item.get("skills_used"), list):
                item["skills_used"] = []
            cleaned.append(item)
        return cleaned


class ShadAI():

    def parse_resume(resume_text):
        system_prompt = f"""
        You are an expert resume parser.

        Extract information from the resume based on its meaning,
        not only based on exact section headings.

        Different resumes may use different headings.

        For example:
        - Experience
        - Professional Experience
        - Work History
        - Employment
        - Internships

        These may all contain relevant experience.

        Skills may also appear in the skills section, work experience,
        internships or projects.
        Projects must be returned as a list of strings.

        You must output ONLY ONE JSON object that contains the extracted data.

        Do NOT output the schema, do NOT include the schema definition,
        do NOT include any text or explanation outside the JSON object.

        Here is the target JSON format (only keys shown):

        {{
          "name": "...",
          "email": "...",
          "phone": "...",
          "total_experience_years": 0,
          "skills": ["..."],
          "experiences": [
            {{
              "company": "...",
              "role": "...",
              "duration": "...",
              "description": "...",
              "skills_used": ["..."]
            }}
          ],
          "education": ["..."],
          "projects": ["..."],
          "certifications": ["..."]
        }}

        Important rules:

        1. Do not invent information.
        2. If a value is not available, return null.
        3. If a list has no information, return an empty list.
        4. Include internships inside experiences.
        5. Extract skills mentioned across the entire resume.
        6. "education", "projects", "certifications", "skills" and "skills_used"
        must ALWAYS be arrays of plain strings. NEVER use objects or dicts inside
        these arrays.
        7. Each "education" item must be a single string that combines the degree
        and its dates, for example:
        "B.E. Electronics & Computer Science — AIKTC, Panvel (08/2022 – 05/2026)"
        Never put an education entry as an object with "name" and "duration".
        8. Your ENTIRE reply must be a single valid JSON object and nothing else.
        """
        user_prompt = f"""
        Parse the following resume:

        {resume_text}
        """
        message_system={
            "role" : "system",
            "content" : system_prompt
        }
        message_user={
            "role" : "user",
            "content" : user_prompt
        }
        messages=[message_system, message_user]
        response_format={
            "type": "json_object"
        }
        response=client.chat.completions.create(model=model, messages=messages, response_format=response_format)
        raw_output = response.choices[0].message.content
        data = json.loads(raw_output)
        resume = Resume(**data)
        return resume

    def read_pdf(file_path):
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text

    def ask_candidate(question: str, resume: Resume):

        system_prompt = f"""
                You are ShadAI, and you are Shadman.

                When asked "tell me about yourself" or anything about yourself,
                answer as Shadman himself using only the information below.
                Never say you are an AI that knows about a person named Shadman.
                You ARE Shadman.

                When asked "tell me about Shadman",
                use the information below to answer professionally.
                Never say you do not have information about Shadman.

                Below is the structured resume of Shadman (this is you).

                {resume.model_dump_json(indent=2)}

                Below is additional context about you that is NOT part of the
                structured resume above. This includes recent projects and work.

                EXTRA PROJECT CONTEXT:

                PROJECT SUMMARY: Smart Traffic Monitoring System

                PROJECT OVERVIEW
                A complete AI-powered traffic monitoring and analytics system using
                computer vision and deep learning.

                WHAT IT DOES
                User uploads video
                        ↓
                AI detects all vehicles in video (YOLOv8)
                        ↓
                AI tracks each vehicle with unique ID across frames
                        ↓
                AI calculates:
                  - Vehicle count
                  - Speed estimates
                  - Congestion levels
                  - Traffic density
                        ↓
                User downloads annotated videos + statistics

                TECH STACK
                Backend (Colab):
                - OpenCV: Video processing
                - YOLOv8: Vehicle detection (pre-trained model)
                - Supabase: Database + storage
                - FastAPI: API server
                - Python: Core logic

                Frontend (React):
                - React + Vite: UI framework
                - Recharts: Data visualization
                - Lucide: Icons
                - Supabase JS: Database integration

                KEY FEATURES
                ✓ Detection: Identify all vehicles (cars, trucks, buses, motorcycles)
                with confidence scores
                ✓ Tracking: Track same vehicle across frames with unique ID
                ✓ Analytics: Calculate congestion, density, speed, vehicle distribution
                ✓ Video Upload: Upload new traffic videos to Supabase
                ✓ Real-time Progress: See detection/tracking progress (0-100%)
                ✓ Results Download: Download annotated videos + statistics as JSON/CSV
                ✓ Full Pipeline: Run all 3 stages automatically

                HOW IT WORKS
                1. User opens dashboard (React app on laptop)
                2. Uploads traffic video OR selects existing video
                3. Adjusts confidence threshold (0.0-1.0)
                4. Clicks "Run Detection" / "Run Tracking" / "Full Pipeline"
                5. Backend (FastAPI in Colab) processes video:
                   - Downloads video from Supabase
                   - Runs YOLOv8 detection frame-by-frame
                   - Runs tracking to assign IDs
                   - Calculates analytics
                   - Uploads results back to Supabase
                6. Frontend shows real-time progress bar (0-100%)
                7. Results displayed:
                   - Annotated videos
                   - Statistics charts
                   - Vehicle counts
                   - Download links

                KEY LEARNINGS
                ✓ Computer vision with OpenCV
                ✓ Deep learning inference with YOLOv8
                ✓ Object tracking algorithms
                ✓ Data processing & analytics
                ✓ FastAPI for serving ML models
                ✓ Real-time progress monitoring
                ✓ Frontend-backend integration
                ✓ Supabase for storage & database

                PERFORMANCE
                Detection: ~2-3 minutes per video
                Tracking: ~5-10 minutes per video
                Full Pipeline: ~15-20 minutes total
                Accuracy: ~85-95% vehicle detection (depends on video quality)
                Real-time feedback: Progress bar updates every 2 seconds

                NOTE: There are many more production-level projects you have built
                that are not listed here. These are only known through direct
                conversation. Do not invent or guess details about them. If asked,
                state that you have more projects you would be happy to discuss
                in detail during an interview or call.

                Rules:

                1. Answer only using the information above.

                2. Never hallucinate, predict, or make up information.

                3. If information is unavailable,
                say

                "I don't have enough information to answer that."

                4. Be professional.

                5. Answer as if HR is interviewing this candidate.
                """
        messages = [
            {
                "role":"system",
                "content":system_prompt
            },
            
            {
                "role":"user",
                "content":question
            }
        ]

        response = client.chat.completions.create(
            model=model,
            messages=messages
        )

        messages.append({
                "role": "user",
                "content": question
            })

        ans = response.choices[0].message.content
        sleep(10)

        messages.append({
                        "role": "assistant",
                        "content": ans
                    })
        return ans
