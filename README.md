# 🧠  AI-Powered Interview Simulator

> Practice smarter. Get hired faster.

AI-Powered Interview Simulator is a full-stack AI-powered mock interview platform that generates technical questions, evaluates your answers in real-time, tracks your progress, and helps you eliminate weak areas — all powered by Google Gemini AI.

---

## 🌐 Live Demo

🔗 [[interview_simulator.vercel.a(https://interview-simulator-ibou.vercel.app/))](https://interview-simulator-ibou.vercel.app/)

---

## ✨ Features

### 🤖 AI-Powered Core
- **Smart Question Generation** — Gemini AI generates 5 role-specific technical questions per session based on your chosen role, difficulty, and topic
- **Real-time Answer Evaluation** — Every answer is evaluated on 3 dimensions: Correctness, Clarity, and Depth (each scored 0–10)
- **Ideal Answer Comparison** — AI provides the perfect answer alongside your response
- **Follow-up Questions** — If your answer scores below 7, AI generates a targeted follow-up to probe deeper
- **Weakness Engine** — AI analyzes your weak topics and generates personalized improvement plans

### 📊 Progress Tracking
- **Score Trend Chart** — Visual line chart showing your performance over time
- **Session History** — Full breakdown of every past interview with answer vs ideal answer comparison
- **Weak Topic Analysis** — Bar chart showing your most struggled topics with frequency
- **Adaptive Difficulty** — System recommends harder or easier questions based on your last session score

### ⏱️ Interview Modes
- **Timed Sessions** — Choose 5, 10, or 15 minute interview modes
- **Auto-submit** — Unanswered questions auto-submit when timer expires
- **Visual Timer** — Color-coded countdown (green → yellow → red)

### 🔐 Authentication
- **Google OAuth** — One-click sign in with Google
- **Email & Password** — Traditional registration and login
- **Protected Routes** — All dashboard pages require authentication
- **Per-user Data** — All sessions, scores, and weak topics are isolated per user

### 🎨 UI/UX
- **Dark / Light / System** theme toggle
- **Responsive design** — Works on desktop and mobile
- **Skeleton loading** states throughout
- **Toast notifications** for all actions
- **Professional SaaS-style** interface built with shadcn/ui

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type safety throughout |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible UI components |
| **Recharts** | Score trend and weak topic charts |
| **Lucide React** | Icon library |
| **next-themes** | Dark/light mode management |

### Backend
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | Serverless API endpoints |
| **Prisma ORM v7** | Type-safe database client |
| **PostgreSQL (Neon)** | Serverless database |
| **NextAuth v5** | Authentication (Google + Credentials) |
| **bcryptjs** | Password hashing |

### AI
| Technology | Purpose |
|---|---|
| **Google Gemini AI** | Question generation & answer evaluation |
| **@google/generative-ai** | Official Gemini SDK |

---

### Models
- **User** — Auth info, profile, linked sessions and weak topics
- **InterviewSession** — Role, difficulty, topic, timestamp
- **Question** — AI-generated question content linked to session
- **Answer** — User's answer linked to question
- **Evaluation** — AI scores (correctness, clarity, depth), feedback, ideal answer
- **Score** — Aggregated session score and accuracy
- **WeakTopic** — Topic + frequency counter per user

---

## 🔄 Application Flow

```
1. User registers / signs in
        ↓
2. Selects Role + Difficulty + Topic + Duration
        ↓
3. AI generates 5 technical questions (Gemini)
        ↓
4. User answers questions within time limit
        ↓
5. Each answer → saved → AI evaluates (correctness/clarity/depth)
        ↓
6. If score < 7 → AI generates follow-up question
        ↓
7. All answers evaluated → Final score calculated
        ↓
8. Weak topics tracked → Dashboard updated
        ↓
9. Next session → Adaptive difficulty recommended
```

---


---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)
- Google Cloud account (for OAuth)
- Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/sanidhyatilekar18/interview_simulator.git
cd interview_simulator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root:
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Set up the database
```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run the development server
```bash
npm run dev
```

Open http://localhost:3000 

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |

---

## 🤖 Prompt Engineering

### Question Generation Prompt
Gemini is prompted to generate exactly 5 questions as a JSON array:
```
Generate 5 {difficulty} level interview questions for a {role} role 
focused on {topic}.
Return ONLY a JSON array: [{ "question": "..." }]
```

### Answer Evaluation Prompt
Gemini acts as a senior technical interviewer and returns structured JSON:
```
Evaluate the candidate's answer on:
- correctness: factual accuracy (0-10)
- clarity: communication quality (0-10)  
- depth: technical depth & examples (0-10)
- feedback: detailed constructive feedback
- idealAnswer: concise high-quality answer
```

### Follow-up Generation Prompt
Context-aware follow-up targeting the candidate's weak area:
```
The candidate answered poorly. Generate ONE targeted follow-up 
question based on their weak area.
```

### Weakness Suggestions Prompt
Personalized improvement plan per weak topic:
```
Generate improvement plan with:
- importance: why this topic matters
- studyPoints: 3 specific things to study
- exercise: 1 practical exercise
```

---

## 📈 Scoring System

| Metric | Calculation |
|---|---|
| **Per-question score** | `(correctness + clarity + depth) / 3` |
| **Session total score** | `average of all question scores` |
| **Accuracy** | `(totalScore / 10) * 100` |
| **Weak topic trigger** | `correctness < 6` |
| **Difficulty up** | `totalScore >= 7` |
| **Difficulty down** | `totalScore < 5` |

---

