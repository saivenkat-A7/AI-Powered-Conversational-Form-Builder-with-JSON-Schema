# AI Form Builder

An AI-powered conversational form builder that generates complex JSON Schema forms through interactions with a Large Language Model (Google Gemini).

##  Architecture

The application follows a modern decoupled architecture, combining AI intelligence with strict schema validation.

- **Frontend (React + Vite)**:
  - **Live Form Renderer**: Uses `@rjsf/core` to instantly render the generated JSON Schema.
  - **Conversational UI**: A sleek chat interface for interacting with the AI.
  - **Schema Diff Panel**: Visualizes structural changes between form versions using `deep-diff`.
  - **State Management**: powered by **Zustand** for efficient global state handling.
- **Backend (Node.js + Express)**:
  - **Gemini Integration**: Interfaces with Google's Generative AI to translate natural language into structured JSON.
  - **Validation Engine**: Uses `ajv` to strictly validate schemas against Draft 7 standards before serving them to the frontend.
  - **Conversation Management**: Maintains context and history to allow iterative form building.
  - **Retry Mechanism**: Automatically retries LLM requests upon validation failure (up to 2 retries).
- **In-Memory Store**: A simple yet effective storage system for managing multiple concurrent user sessions.

##  Key Features

- **Conversational Form Building**: Create and update complex forms just by talking to the AI.
- **Ambiguity Detection**: The AI detects vague requests and asks clarifying questions instead of guessing.
- **Live Preview & Hot Reload**: See your form update in real-time as you describe changes.
- **Structural Versioning**: Track changes between iterations with a dedicated diff panel.
- **Conditional Logic**: Built-in support for visibility rules via custom `x-show-when` tags.
- **Dockerized Environment**: One-command setup for development and testing.

##  Challenges & Solutions

| Challenge | Solution |
| :--- | :--- |
| **LLM Hallucinations** | Implemented a strict **AJV validation** layer on the backend. If the AI generates invalid schema, the system triggers an automatic **retry loop** with error feedback sent back to the model for correction. |
| **Ambiguity Management** | Developed a "Clarification" response structure. When a prompt is too vague, the backend forces the LLM to output a list of questions rather than a malformed schema. |
| **Schema Consistency** | Used custom RJSF extensions to handle non-standard schema properties like visibility logic without breaking the core parser. |

##  Future Improvements

- [ ] **Persistent Storage**: Move from in-memory maps to a robust database like PostgreSQL or MongoDB.
- [ ] **Code Export**: Allow users to download the generated React components or raw JSON files.
- [ ] **Multi-Model Support**: Integration with OpenAI (GPT-4) and Anthropic (Claude) for comparison.
- [ ] **Interactive Onboarding**: A guided tour for first-time users to explore the builder's capabilities.
- [ ] **Custom Themes**: Allow the AI to suggest and apply CSS themes to the generated forms.

##  Prerequisites

- Docker and Docker Compose
- Node.js (if running locally without Docker)
- A Google Gemini API Key

##  Setup Instructions

1. Clone this repository.
2. In the `backend` directory, there is a `.env.example` file. Copy this file into a newly created `.env` file OR fill your `LLM_API_KEY` directly inside `backend/.env`.
```
LLM_API_KEY="your_free_gemini_api_key_here"
```

##  Running the Application

To run the entire stack with Docker:
```bash
docker-compose up --build
```
This will start:
- Backend server on `http://localhost:8080`
- Frontend React application on `http://localhost:3000`

Access the React application in your browser at `http://localhost:3000`.

##  Testing

You can test the application manually using the Chat interface, or automatically using HTTP clients like `curl`.

```bash
# Test health endpoint
curl http://localhost:8080/health

# Test form generation endpoint
curl -X POST http://localhost:8080/api/form/generate -H "Content-Type: application/json" -d '{"prompt": "A contact form with name and email"}'

# Test mock LLM failure and retry logic
curl -X POST "http://localhost:8080/api/form/generate?mock_llm_failure=3" -H "Content-Type: application/json" -d '{"prompt": "A contact form"}'
```
