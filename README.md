<img width="1470" height="836" alt="Screenshot 2026-05-03 at 13 19 56" src="https://github.com/user-attachments/assets/88f344b1-8ce1-4148-9028-8cb4321ef0bc" />

# Hackathon Competition Platform

A three-service monorepo that powers data-science challenges with a Vite + React web app, a Spring Boot API backed by MongoDB, and a Node.js worker that scores CSV submissions. Everything needed to demo or host a local hackathon lives here.

## Feature Overview
- Modern challenge hub built in React 19 + Tailwind with protected routes, submission dialogs, and admin pages.
- JWT authentication with team and admin roles, profile updates, and simple route guards.
- Challenge lifecycle tools for admins (create, edit, delete) plus public details and leaderboard pages for players.
- CSV submission pipeline with duplicate detection, storage on disk, download endpoints, and worker-driven scoring.
- Background worker that polls the API, calculates Accuracy/RMSE/ROC-AUC/F1 scores, hashes uploads to flag plagiarism, and posts results back.
- Seeded MongoDB data for demo accounts, sample challenges, and mock submissions, plus auto-generated OpenAPI docs at `/swagger-ui.html`.

## System Overview
All services run locally, communicate over HTTP, and rely on MongoDB for persistence. The worker never exposes endpoints; it polls the API instead.

```text
React/Vite Frontend (5173) --> Spring Boot API (8080) --> MongoDB 7 (Docker 27017)
                                            |
                                            └─ Node.js Worker (polls queue, scores files)
```

## Repository Map

| Path | Purpose |
| --- | --- |
| `frontend/` | React + Vite client with pages such as challenge list, details, submissions, admin editor, and team profile. |
| `backend-core/` | Spring Boot 3.5 service (controllers, services, security, Mongo repositories, upload handling, seeding). |
| `backend-core/docker-compose.yml` | One-container stack that brings up MongoDB 7 with a named volume and health checks. |
| `backend-core/uploads/` | Local disk folder where uploaded CSV files are stored before the worker processes them. |
| `backend-worker/` | Node.js scoring worker (queue polling, scoring logic, DB connector, env example, tests, sample submissions). |
| `backend-worker/data/` | Ground-truth CSV assets (accuracy, RMSE, ROC-AUC variants) used by the scoring service. |
| `package.json` (root) | Scripts for installing dependencies everywhere and starting all services together via `concurrently`. |

## Tech Stack

| Layer | Main tools | Details |
| --- | --- | --- |
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS 4, Radix UI, React Router 7 | SPA with `AuthContext`, guarded routes, SubmissionDialog (file uploads), leaderboard tables, and theme helpers. |
| Core API | Spring Boot 3.5, Spring Security + JWT, MongoDB, Jakarta Validation, springdoc-openapi | Provides `/api/**` endpoints, seeds demo data, handles file uploads, roles (`ROLE_USER`, `ROLE_ADMIN`), and exposes Swagger UI. |
| Worker | Node.js 20, axios, mongoose, csv-parser, crypto | Polls `/api/internal/submissions/next`, reads CSVs, calculates Accuracy/RMSE/ROC-AUC/F1, detects duplicates via SHA-256, and posts results back. |
| Tooling | Docker Compose, Maven Wrapper, ESLint, TypeScript, concurrently | Makes setup repeatable and lets you boot the whole stack with one command. |

## Prerequisites
- Node.js 20+ and npm 10+ (frontend, worker, and root scripts).
- Java 25 (matching the `pom.xml` release). If you only have JDK 21/23, update `<java.version>` accordingly before building.
- Docker Desktop (or Docker Engine with Compose plugin) to start MongoDB 7 locally.
- Git and a POSIX shell.

## Setup

### 1. Install dependencies

```bash
npm install
npm run install:all
```

The first command installs the root tooling (`concurrently`). The second command runs `npm install` inside `frontend/` and `backend-worker/`.

### 2. Configure environment

#### Backend core (Spring Boot)

The config file sits at `backend-core/src/main/resources/application.properties`. Update any of the following values if needed:

| Property | Description | Default |
| --- | --- | --- |
| `server.port` | API port | `8080` |
| `spring.data.mongodb.uri` | MongoDB connection string | `mongodb://localhost:27017/hackathondb` |
| `hackathon.jwt.secret` | Secret for signing access tokens | `super-secret-jwt-key-please-change-1234567890` |
| `hackathon.jwt.expiration-ms` | Token lifetime | `3600000` (1 hour) |
| `hackathon.storage.upload-dir` | Where CSV uploads are stored | `./uploads` (relative to `backend-core`) |
| `hackathon.max-file-size-bytes` | Upload size limit | `52428800` (50 MB) |
| `worker.secret` | Shared secret checked by `/api/internal/**` | `k3G9s8FaP1qX7Zb2Rm4U8tN5cQ0L9Hw6` |
| `worker.api.url` | Base URL used when the API sends files to the worker | `http://localhost:8081` |

Make sure `worker.secret` matches the worker’s `WORKER_SECRET`.

#### Worker `.env`

Copy the template and fill in real values:

```bash
cp backend-worker/.env.example backend-worker/.env
```

| Variable | Description | Example |
| --- | --- | --- |
| `MONGO_URI` | Mongo connection for the worker (used for logging/future jobs) | `mongodb://localhost:27017/hackathondb` |
| `CORE_API` | Base URL for the Spring Boot API | `http://localhost:8080` |
| `WORKER_SECRET` | Must match `worker.secret` in the API | `k3G9s8FaP1qX7Zb2Rm4U8tN5cQ0L9Hw6` |

#### Frontend API target

The client currently reads the API base URL from `frontend/src/lib/api.ts`. Update `const API_URL = 'http://localhost:8080/api';` if you host the API elsewhere.

### 3. Start MongoDB

```bash
npm run start:db
```

This runs `docker compose -f backend-core/docker-compose.yml up` and keeps MongoDB healthy on port `27017`.

### 4. Start the entire stack

```bash
npm run start
```

You’ll see four processes managed by `concurrently`:

- `DB`: MongoDB container
- `API`: Spring Boot dev server (`./mvnw spring-boot:run`)
- `WEB`: Vite dev server (`http://localhost:5173`)
- `WORKER`: Node queue listener (`backend-worker/src/services/index.js`)

Stop everything with `Ctrl+C`.

### 5. Start services manually (optional)

- MongoDB: `docker compose -f backend-core/docker-compose.yml up`
- API: `cd backend-core && ./mvnw spring-boot:run`
- Frontend: `cd frontend && npm run dev` (opens on `http://localhost:5173`)
- Worker: `cd backend-worker && npm start`

## Demo & seed data

`DataSeeder` wipes MongoDB on every API boot and inserts sample users, challenges, and submissions:

| Role | Email | Password |
| --- | --- | --- |
| Admin (can manage challenges/users) | `admin@hack.com` | `admin123` |
| Team 1 | `team1@hack.com` | `123456` |
| Team 2 | `team2@hack.com` | `123456` |
| Team 3 | `team3@hack.com` | `123456` |
| Team 4 | `team4@hack.com` | `123456` |

Use these accounts to explore the UI quickly. Modify `DataSeeder` if you need persistent data.

## Key API areas

- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Team profile: `GET/PUT /api/team/profile`
- Challenges: `GET /api/challenges`, `GET /api/challenges/{id}`
- Leaderboard: `GET /api/challenges/{id}/leaderboard`
- Submissions: `POST /api/submit` (multipart CSV), `GET /api/submissions/my`, `GET /api/submissions/{id}`, `GET /api/submission/{id}/file`
- Admin-only: `/api/admin/challenges` (CRUD), `/api/admin/users`
- Worker-only: `GET /api/internal/submissions/next`, `POST /api/internal/submissions/{id}/result`
- API docs live at `http://localhost:8080/swagger-ui.html`

## Worker scoring flow

1. A team uploads a CSV via the submission dialog.
2. The API saves the file under `backend-core/uploads`, calculates a SHA1 hash to reject duplicates, and marks the record as `PENDING`.
3. The worker polls `/api/internal/submissions/next` using the shared secret.
4. When a task arrives, the worker reads the CSV path, loads the correct ground-truth file based on the challenge metric, and evaluates the predictions (Accuracy, RMSE, ROC-AUC, or F1).
5. The worker hashes the file (SHA-256) for plagiarism tracking and posts either a `DONE` or `FAILED` payload to `/api/internal/submissions/{id}/result`.
6. The API updates the submission status, score, and metadata so the leaderboard and “My Submissions” page show the new results.

## Tests & quality checks

| Layer | Command | Notes |
| --- | --- | --- |
| API | `cd backend-core && ./mvnw test` | Uses Spring Boot test starter and embedded Mongo (Flapdoodle). |
| Frontend | `cd frontend && npm run lint` | ESLint + TypeScript rules. |
| Worker | `cd backend-worker && npm test` | Runs `src/tests/scoringService.test.js` against sample CSVs. |

For production builds, run `cd frontend && npm run build` and `cd backend-core && ./mvnw package`.

## Storage & assets

- Uploaded files live under `backend-core/uploads` (configurable via `hackathon.storage.upload-dir`).
- Worker ground-truth data is under `backend-worker/data`.
- Temporary worker artifacts (`test-submissions/`) help you validate scoring locally.
- Mongo data persists in the `mongo-data` Docker volume.

## Troubleshooting

- **Worker 403 errors**: The `WORKER_SECRET` in `.env` must match `worker.secret` in `application.properties`.
- **Duplicate submission message**: The API hashes each CSV. Change the file contents before re-uploading.
- **API fails to start because of Java version**: Install a JDK that matches `<java.version>` or lower the property to your installed version.
- **Mongo container keeps restarting**: Make sure Docker Desktop is running and that port `27017` is free.
