# ProblemBridge - Full-Stack Collaborative Problem & Solution Platform

ProblemBridge is a full-stack platform where users can post real-world challenges, explore proposed solutions, inspect owner profiles, send permission-gated collaboration requests ("I'm Interested" / "I Have a Solution"), and collaborate in real-time.

It runs completely locally on any laptop with zero complex database setup required.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons, Vite
- **Backend**: Node.js & Express (`server.ts`) serving RESTful API routes & Vite middleware
- **Database**: Local JSON File Database (`src/db/db.json` & `src/db/database.ts`) with atomic read/write persistence for users, problems, proposals, connection requests, chat threads, and notifications
- **AI Assist**: Integrated Gemini AI doubt solver and suggestion endpoints (`/api/ai/doubt-solver`)

---

## 🚀 How to Run on Your Local Laptop

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (comes bundled with Node.js)

### 2. Installation
Open your terminal in the extracted project folder and run:
```bash
npm install
```

### 3. Start the Application
Run the unified full-stack dev server:
```bash
npm run dev
```

The application will start immediately at:
**`http://localhost:3000`**

Both the Express backend API (`/api/*`) and the React Vite frontend are served concurrently on port 3000.

---

## 🗄️ Database Architecture

The database is stored in `src/db/db.json` and handled by `src/db/database.ts`. It provides schema validations and persistent storage across server restarts:

- **`users`**: Profiles, avatar, bio, skills, verified badge, stats (problems posted, solutions delivered, ratings).
- **`problems`**: Challenge title, description, category, difficulty, bounty/budget, status, tags, owner info.
- **`proposals`**: Solutions submitted by builders, architecture details, attachments, timestamps.
- **`connectionRequests`**: Permission-gated requests ("interested" or "solution_proposal") with statuses `pending`, `approved`, or `declined`.
- **`chatThreads`**: Direct messaging channel between builder and owner that unlocks **only after the owner approves the request**.
- **`notifications`**: Activity feed alerts for requests, approvals, and messages.

---

## 🔌 API Endpoints

- `GET /api/database/stats` - Overall database count and health
- `GET /api/problems` & `POST /api/problems` - List and submit problems
- `GET /api/proposals` & `POST /api/proposals` - Solutions and proposals
- `GET /api/users` & `GET /api/users/:id` - User and owner profiles
- `GET /api/connection-requests` & `POST /api/connection-requests` - Send collaboration requests
- `PATCH /api/connection-requests/:id/approve` - Approve connection request (unlocks chat)
- `PATCH /api/connection-requests/:id/decline` - Decline connection request
- `GET /api/threads` & `POST /api/threads/:threadId/messages` - Chat threads
- `GET /api/notifications` - Notifications feed

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
npm start
```
