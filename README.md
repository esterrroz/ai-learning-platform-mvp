# AI-Driven Learning Platform — MVP 🎓

> A full-stack AI-powered learning platform that summarizes content, generates personalized quizzes, and tracks learning history — built with React, Node.js, PostgreSQL, and OpenAI.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Prerequisites](#-prerequisites)
5. [Setup Guide](#-setup-guide)
6. [Environment Variables](#-environment-variables)
7. [Database Schema](#-database-schema)
8. [API Reference](#-api-reference)
9. [Features](#-features)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

פלטפורמת למידה חכמה המאפשרת למשתמשים:
- להעלות טקסט או PDF ולקבל **סיכום AI** בשניות
- לייצר **חידון אינטראקטיבי** עם 3 שאלות רב-ברירה מבוססות הסיכום
- לשמור חומרי לימוד ולנהל **ספרייה אישית**
- לצפות בציון הסופי עם **פידבק מפורט** לכל שאלה

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express 5 |
| Database | PostgreSQL 15 |
| AI | OpenAI GPT-4o |
| DevOps | Docker + Docker Compose |
| HTTP Client | Axios |
| Routing | React Router DOM v7 |

---

## 📂 Project Structure

```
ai-learning-platform-mvp/
├── backend/
│   ├── config/
│   │   └── db.js                  # PostgreSQL connection pool + dotenv
│   ├── models/
│   │   ├── schema.sql             # Table definitions + seed data
│   │   └── initDb.js              # DB initializer (idempotent, transactional)
│   ├── routes/
│   │   ├── materialRoutes.js      # /api/materials — summarize, quiz, CRUD
│   │   └── categoryRoutes.js      # /api/categories — list, subcategories
│   ├── services/
│   │   ├── aiService.js           # summarizeText, generateQuiz (OpenAI)
│   │   ├── pdfService.js          # PDF text extraction
│   │   └── ai/
│   │       └── quizService.js     # generateQuizFromSummary (structured JSON)
│   ├── .env                       # Environment variables (not committed)
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Summarizer + Generate Quiz flow
│   │   │   ├── QuizGenerator.jsx  # Browse materials + generate quiz
│   │   │   ├── QuizTaking.jsx     # Interactive quiz + score screen
│   │   │   ├── MyLibrary.jsx      # Saved materials library
│   │   │   ├── UploadNew.jsx      # Upload + save new material
│   │   │   └── Sidebar.jsx        # Navigation sidebar
│   │   ├── services/
│   │   │   └── api.js             # All Axios API calls
│   │   ├── styles/                # Per-component CSS files
│   │   ├── App.jsx                # Router + layout
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── docker-compose.yml             # PostgreSQL container
└── README.md
```

---

## ✅ Prerequisites

Make sure the following are installed before starting:

- **Node.js** v18 or higher — [nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **Docker Desktop** — [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **OpenAI API Key** — [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

To verify your installations:
```bash
node --version    # v18+
npm --version     # v9+
docker --version  # any recent version
```

---

## 🚀 Setup Guide

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd ai-learning-platform-mvp
```

### Step 2 — Start the database

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 container on port `5432` with:
- User: `user`
- Password: `password`
- Database: `learning_db`

Verify it's running:
```bash
docker ps
# Should show: ai-learning-platform-mvp-db-1   Up
```

### Step 3 — Configure the backend environment

```bash
cd backend
```

Create a `.env` file (or edit the existing one):

```env
DB_USER=user
DB_PASSWORD=password
DB_NAME=learning_db
DB_HOST=localhost
DB_PORT=5432
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sk-proj-your-key-here
```

> ⚠️ Replace `sk-proj-your-key-here` with your actual OpenAI API key.

### Step 4 — Install backend dependencies

```bash
# Inside /backend
npm install
```

### Step 5 — Start the backend server

```bash
npm run dev
```

Expected output:
```
🚀 Starting server...
⏳ Waiting for database to be ready...
✅ Database is ready
📝 Initializing database schema...
✅ Database tables initialized successfully
✅ Server is running on port 5000
```

The backend runs on **http://localhost:5000**

> ⚠️ **Both servers must be running simultaneously.** The frontend (port 5173) calls the backend (port 5000) for all AI and data operations. Open two separate terminal windows — one for the backend and one for the frontend.

### Step 6 — Install frontend dependencies

Open a new terminal:

```bash
cd frontend
npm install
```

### Step 7 — Start the frontend

```bash
npm run dev
```

Expected output:
```
  VITE v8.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. ✅

> 💡 **Quick reminder:** You need **3 things running at the same time**:
> 1. Docker (PostgreSQL) — `docker-compose up -d`
> 2. Backend — `npm run dev` inside `/backend` (port 5000)
> 3. Frontend — `npm run dev` inside `/frontend` (port 5173)

---

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL username | `user` |
| `DB_PASSWORD` | PostgreSQL password | `password` |
| `DB_NAME` | Database name | `learning_db` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `JWT_SECRET` | Secret key for signing JWTs | — |
| `OPENAI_API_KEY` | Your OpenAI API key | — |

> The `OPENAI_API_KEY` must belong to a project with access to `gpt-4o`.

---

## 🗄 Database Schema

All tables are created automatically on first server start via `initDb.js`.

```
users
├── id          SERIAL PRIMARY KEY
├── name        VARCHAR(255) NOT NULL
├── phone       VARCHAR(20)
└── created_at  TIMESTAMP

categories
├── id          SERIAL PRIMARY KEY
├── name        VARCHAR(255) NOT NULL UNIQUE
└── created_at  TIMESTAMP

sub_categories
├── id          SERIAL PRIMARY KEY
├── name        VARCHAR(255) NOT NULL
├── category_id INTEGER → categories(id) ON DELETE CASCADE
├── created_at  TIMESTAMP
└── UNIQUE (name, category_id)

prompts
├── id              SERIAL PRIMARY KEY
├── user_id         INTEGER → users(id) ON DELETE CASCADE
├── category_id     INTEGER → categories(id) ON DELETE CASCADE
├── sub_category_id INTEGER → sub_categories(id) ON DELETE CASCADE
├── prompt          TEXT NOT NULL
├── response        TEXT
└── created_at      TIMESTAMP

materials
├── id            SERIAL PRIMARY KEY
├── title         VARCHAR(500) NOT NULL
├── original_text TEXT NOT NULL
├── summary       TEXT
├── quiz          JSON
├── created_at    TIMESTAMP
└── updated_at    TIMESTAMP

quizzes
├── id          SERIAL PRIMARY KEY
├── material_id INTEGER → materials(id) ON DELETE CASCADE
├── questions   JSONB NOT NULL
├── score       INTEGER
└── created_at  TIMESTAMP
```

**Seed data** (inserted automatically, idempotent):
- Categories: `Programming`, `Languages`, `Cooking`
- Sub-categories: `JavaScript`, `Python`, `Web Development`, `English`, `Spanish`, `French`, `Italian Cuisine`, `Asian Cuisine`, `Baking`

---

## 📡 API Reference

### Materials

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/materials/summarize` | Summarize text with AI |
| `POST` | `/api/materials/generate-quiz` | Generate quiz from a summary |
| `POST` | `/api/materials/:id/generate-quiz` | Generate & save quiz for a saved material |
| `POST` | `/api/materials/extract-pdf` | Extract text from uploaded PDF |
| `GET` | `/api/materials` | Get all saved materials |
| `GET` | `/api/materials/:id` | Get a single material |
| `POST` | `/api/materials` | Save a new material |
| `DELETE` | `/api/materials/:id` | Delete a material |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/categories` | Get all categories |
| `GET` | `/api/categories/:id/subcategories` | Get subcategories for a category |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server + DB status |

---

## ✨ Features

### Summarizer (Dashboard)
1. Paste text or upload a PDF (max 10MB)
2. Click **✨ Summarize** — AI generates a 2-3 sentence summary
3. Click **🎯 Generate Quiz** — AI creates 3 multiple-choice questions
4. Automatically navigates to the Quiz tab to take the quiz
5. Click **💾 Save Material** to store in your library

### Quiz Generator
- Browse all saved materials with search/filter
- Select a material → click **🤖 Generate AI Quiz**
- Quiz is saved to the `quizzes` table in the database
- Preview questions before starting

### Quiz Taking
- Progress bar + question indicators
- Immediate correct/incorrect feedback per answer
- Navigate freely between questions
- **Finish** button (enabled only when all questions answered)
- Final score screen with:
  - Percentage circle
  - Emoji feedback (🏆 ⭐ 👍 💪 📚)
  - Per-question breakdown with correct answers

### My Library
- View all saved materials
- See which materials have summaries and quizzes

---

## 📚 Documentation

The backend exposes an interactive Swagger UI at **`/api-docs`**.

### How to access

1. Start the backend server (`npm run dev` inside `/backend`)
2. Open your browser and navigate to:

```
http://localhost:5000/api-docs
```

You will see a fully interactive OpenAPI 3.0 interface where you can:
- Browse all available endpoints grouped by tag (Users, Categories, Materials)
- Inspect request parameters, request body schemas, and expected responses
- Execute live requests directly from the browser using the **"Try it out"** button

---

## 🔧 Troubleshooting

**Database connection refused**
```bash
# Make sure Docker is running
docker-compose up -d
docker ps  # verify container is Up
```

**`gpt-3.5-turbo` 403 error**
> Your API key only has access to `gpt-4o`. Both `aiService.js` and `quizService.js` are already configured to use `gpt-4o`.

**Sub-categories duplicating on restart**
> Fixed — `initDb.js` uses `ON CONFLICT (name, category_id) DO NOTHING` with a proper `UNIQUE` constraint. Each restart is fully idempotent.

**Port 5173 already in use**
```bash
# Kill the process using the port
npx kill-port 5173
npm run dev
```

**Port 5000 already in use**
```bash
npx kill-port 5000
# Then restart the backend
```

**OpenAI API key not working**
- Verify the key is active at [platform.openai.com](https://platform.openai.com)
- Make sure the project has `gpt-4o` access enabled
- Check the key is correctly set in `backend/.env` with no extra spaces

---

## 👥 Development Notes

- The backend auto-initializes the DB schema on every start — safe to restart freely
- `sessionStorage` is used to pass a freshly generated quiz from the Dashboard to the Quiz Generator route without requiring a saved material ID
- The `quizzes` table stores questions as `JSONB` for efficient querying; `materials.quiz` stores a `JSON` copy for convenience
- PDF extraction uses `pdf-parse` and runs in-memory (no disk writes)
## 📖 Example Use Case
To demonstrate the platform's flow:
- **User Journey:** A user named "Israel" signs up with his phone number.
- **Selection:** He selects the category **Science** and the sub-category **Space**.
- **Prompt:** He enters: *"Teach me about black holes."*
- **Result:** The system sends the context to OpenAI, returns a structured lesson, and stores it in Israel's history for future review.

## 💡 Assumptions Made
- **Connectivity:** The system requires an active internet connection to interact with the OpenAI API.
- **PDF Format:** The current PDF extraction service supports text-based PDFs. Image-based PDFs (scans) are handled with a user-friendly error message.
- **User Session:** For this MVP, user identification is managed via `localStorage` after a simple registration/login flow.
- **AI Model:** The system is optimized for `gpt-4o` to ensure high-quality educational content and structured JSON outputs.

🚀 Beyond the Requirements (Bonuses Included)
While the task required a basic MVP, I implemented several production-grade features:

Multi-language Support (i18n): Full Hebrew & English support with RTL/LTR layout switching.

PDF Extraction: Users can upload PDFs to generate summaries and lessons.

Advanced UI/UX: Custom-designed navigation cards and modern Glassmorphism-style buttons.
* Dockerized Environment: The entire database setup is automated via Docker Compose.  

Quiz System: An interactive quiz generator based on the AI lesson content.