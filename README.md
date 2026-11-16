# ShadAI – Personal AI Resume Assistant 🤖

**ShadAI** is an AI-powered personal resume assistant designed to represent me professionally during conversations. It uses Large Language Models (LLMs) to understand my resume, extract structured information, and answer questions about my professional background, technical skills, work experience, education, and projects.

Instead of sharing a static resume, ShadAI provides an interactive conversational experience where recruiters, HR professionals, and visitors can directly ask questions about my profile.

🌐 **Live Demo:** https://shad-ai-phi.vercel.app/

---

## 🚀 Key Features

- **AI-Powered Conversations:** Ask questions about my professional background using natural language.
- **Intelligent Resume Parsing:** Extracts structured information from PDF resumes using an LLM.
- **Structured Data Extraction:** Organizes resume information into fields such as name, contact details, experience, skills, education, projects, and certifications.
- **Context-Aware Responses:** Answers questions using structured resume information and additional project context.
- **Personal AI Representation:** Responds as Shadman, providing professional and interview-oriented answers.
- **Hallucination Control:** Uses predefined instructions to prevent the model from inventing unavailable information.
- **Interactive Chat Interface:** Provides a modern chat experience with chat history, search, and a responsive interface.

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| Frontend | React (Vite-based frontend) |
| Frontend Deployment | Vercel |
| Backend | Python, FastAPI |
| LLM Provider | Groq |
| AI Model | OpenAI GPT-OSS 120B |
| Resume Processing | PyPDF |
| Data Validation | Pydantic |
| API Communication | REST API |
| CORS | FastAPI CORSMiddleware |

## 🏗️ Project Architecture

ShadAI follows a frontend-backend architecture.

### 1. Resume Processing

- Loads the resume PDF.
- Extracts text using PyPDF.
- Sends the extracted text to the LLM.
- Converts the extracted information into structured JSON.
- Validates the extracted information using Pydantic models.

### 2. AI Conversation

- Receives a user's question through the chat interface.
- Uses the structured resume information as context.
- Adds predefined project information and system instructions.
- Sends the conversation to the Groq API.
- Generates a professional, context-aware response.

### 3. Frontend Integration

- Users interact with ShadAI through the web interface.
- The frontend sends questions to the FastAPI backend.
- The backend processes the request and returns the generated response.
- The frontend displays the response in the chat interface.

## 📂 Project Structure

```text
ShadAI/
│
├── frontend/                  # Frontend application
│
├── main.py                    # FastAPI application and API endpoints
├── shadai.py                  # Resume parsing and AI conversation logic
│
├── Shadman_Chhapekar_Resume_AI_Engineer_.pdf
│                               # Resume PDF used by the backend
│
├── pyproject.toml              # Python project dependencies and configuration
├── uv.lock                     # Dependency lock file
├── .python-version             # Python version configuration
├── .gitignore                  # Git ignored files
└── README.md                   # Project documentation
```

## ⚙️ Installation & Setup

### Prerequisites

- Python
- uv package manager
- Groq API key
- Node.js and npm (for frontend development)

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ShadAI
```

### 2. Install Backend Dependencies

```bash
uv sync
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key
```

### 4. Add Your Resume

Place the resume PDF in the backend root directory using the filename configured in `main.py`.

### 5. Start the Backend

```bash
uv run uvicorn main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### 6. API Documentation

FastAPI automatically provides interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Checks whether the backend is running. |
| POST | `/chat` | Accepts a question and returns an AI-generated response. |

### Example Request

**POST `/chat`**

```json
{
  "question": "Tell me about your technical skills and projects."
}
```

### Example Response

```json
{
  "message": "I have experience working with Python, Machine Learning, Generative AI, LLMs, Agentic AI, and other AI technologies..."
}
```

## 🧠 AI Implementation

ShadAI uses a structured resume representation powered by Pydantic.

The resume schema includes:

- Personal Information
- Total Professional Experience
- Technical Skills
- Professional Experiences
- Education
- Projects
- Certifications

The AI conversation layer combines this structured information with additional project context to generate relevant answers.

The system uses prompt engineering to maintain a professional communication style and reduce unsupported responses.

## 🔮 Future Enhancements

- Persistent conversational memory.
- Multiple resume versions and dynamic resume selection.
- Advanced recruiter-oriented question handling.
- Resume updates without modifying backend code.
- Improved response streaming.
- Authentication and user management.
- Enhanced resume analytics and insights.

## 👨‍💻 Developer

**Shadman Chhapekar**

AI Engineer | Generative AI | Agentic AI | LLMs | RAG

🌐 **Live Project:** https://shad-ai-phi.vercel.app/

---

⭐ If you find this project interesting, feel free to explore the repository and share your feedback!
