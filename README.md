# AlgoVision — Full-Stack App (React + Tailwind + TS • Express + MongoDB + JWT)

AlgoVision is a learning platform featuring algorithm visualization, complexity analysis, quizzes, and report exports.

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, MongoDB (Mongoose), JWT

## Prerequisites
- Node.js 18+
- npm 8+
- MongoDB (local or Atlas)

## 1) Clone & Install
```bash
# from project root
cd backend && npm i
cd ../frontend && npm i
```

## 2) Configure Environment
Create a `.env` file inside `backend/` (copy values as needed):
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/algovision
JWT_SECRET=replace_me_with_a_secure_value
CLIENT_ORIGIN=http://localhost:5173
```

Optional: Frontend can point at a custom API base using `VITE_API_URL` (defaults to `http://localhost:4000/api`). Create `frontend/.env` if you want to override:
```env
VITE_API_URL=http://localhost:4000/api
```

## 3) Run the App (Development)
Open two terminals:

Terminal A — Backend
```bash
cd backend
npm run dev
# API -> http://localhost:4000
```

Terminal B — Frontend
```bash
cd frontend
npm run dev
# Web -> http://localhost:5173
```

## 4) First Login / Register
- Visit `http://localhost:5173/login`
- Register or login — JWT token is stored in `localStorage`

## Project Structure
```
backend/
  src/
    server.js               # Express app + Mongo connection
    models/
      User.js
      Visualization.js
    routes/
      auth.js               # /api/auth/register, /api/auth/login
      visualizations.js     # /api/visualizations
      quiz.js               # /api/quiz (serves JSON)
      reports.js            # /api/reports, /api/reports/export
    data/
      quiz.json
  package.json

frontend/
  src/
    auth/AuthContext.tsx    # JWT storage & axios instance
    pages/
      LoginPage.tsx
      DashboardPage.tsx
      VisualizationPage.tsx
      ComplexityPage.tsx
      QuizPage.tsx
      ReportsPage.tsx
    App.tsx
    main.tsx
  index.html
  tailwind.config.ts
  vite.config.ts
  tsconfig.json
  package.json
```

## Available Pages
- Login / Register — gradient background, Inter font, JWT note
- Dashboard — 2x2 feature cards
- Visualization — settings + playback + bar chart (Recharts)
- Complexity Analysis — LineChart + BarChart comparisons
- Knowledge Quiz — interactive with modal score summary
- Export Reports — stats grid + JSON export

## API Summary
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/visualizations` (auth)
- POST `/api/visualizations` (auth)
- GET `/api/quiz`
- GET `/api/reports` (auth)
- POST `/api/reports/export` (auth)

Authorization: Bearer token via `Authorization: Bearer <JWT>` header.

## Troubleshooting
- Mongo not running: start local MongoDB or update `MONGO_URI` to Atlas
- CORS issues: verify `CLIENT_ORIGIN` in `backend/.env`
- Frontend can’t reach API: set `VITE_API_URL` or ensure backend runs on `:4000`

## Scripts
- Backend
  - `npm run dev` — start API (development)
  - `npm start` — start API (production)
- Frontend
  - `npm run dev` — start Vite dev server
  - `npm run build` — production build
  - `npm run preview` — preview built app

---
Made with ❤️ for algorithm learners.



