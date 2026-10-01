<img width="1470" height="836" alt="Screenshot" src="https://github.com/user-attachments/assets/88f344b1-8ce1-4148-9028-8cb4321ef0bc" />

# Hackathon ML Competition Platform

> **Goldman Sachs Warsaw Hackathon — 3rd Place Winner**  
> A three-service monorepo for hosting data-science competitions with automated CSV prediction scoring and real-time leaderboards.

---

## System Architecture

All services communicate over HTTP and use MongoDB for persistence. The scoring worker runs asynchronously, polling pending submissions from the API queue.

```text
React / Vite Frontend (5173) ──> Spring Boot API (8080) ──> MongoDB 7 (Docker 27017)
                                           │
                                           └── Node.js Worker (polls queue, scores predictions)
```

---

## Core Services

- **Core API (`backend-core/`):**  
  Spring Boot 3.5, Spring Security (JWT), MongoDB, `springdoc-openapi`.  
  Handles authentication, team roles, challenge lifecycle management, file storage, and exposes Swagger docs at `/swagger-ui.html`.

- **Scoring Worker (`backend-worker/`):**  
  Node.js 20, Axios, Mongoose, CSV-Parser.  
  Asynchronously polls `/api/internal/submissions/next`, validates predictions against ground-truth datasets, calculates metrics (**Accuracy, RMSE, ROC-AUC, F1**), and computes **SHA-256** checksums to flag duplicate/plagiarized submissions.

- **Frontend Client (`frontend/`):**  
  React 19, Vite, TypeScript, Tailwind CSS 4, Radix UI.  
  Features protected routes, submission dialogs with file uploads, challenge editors, and live leaderboard rankings.

---

## Quickstart

### 1. Install Dependencies
```bash
npm install
npm run install:all
```

### 2. Start Database
```bash
npm run start:db
```
*Starts MongoDB 7 in Docker on port `27017`.*

### 3. Run All Services
```bash
npm run start
```
*Spawns the Spring Boot backend (`8080`), React frontend (`5173`), and Node scoring worker concurrently.*

---

## Demo Accounts (Pre-seeded)

The database automatically seeds test accounts on startup:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hack.com` | `admin123` |
| **Team 1** | `team1@hack.com` | `123456` |
| **Team 2** | `team2@hack.com` | `123456` |

---

## Testing

- **Backend:** `cd backend-core && ./mvnw test`
- **Worker:** `cd backend-worker && npm test`
- **Frontend:** `cd frontend && npm run lint`
