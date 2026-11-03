# Dibs — Technical Take-Home Mockup

This repository is a **single-commit snapshot** of the Dibs deals platform, trimmed for
applicants. It includes a Next.js frontend and a Go (Gin) API backed by Postgres.

Production-only pieces (Traefik, deploy workflows, SMS schedulers, cloud object storage,
Gemini, etc.) are removed or stubbed. Image uploads use **local disk** on the API
(`/uploads`).

---

## Project structure

```plaintext
frontend/     # Next.js app (run on the host)
backend/      # Go Gin API (Docker Compose or local)
compose.yaml  # Postgres + API
```

---

## Quick start (local)

### 1. Environment

From the repo root:

```bash
cp .env.example .env
```

Use `POSTGRES_HOST=db` in `.env` when using Docker Compose (default in `.env.example`).

Copy the frontend variables into `frontend/.env.local` (or symlink):

```bash
# PowerShell example
Copy-Item .env frontend/.env.local
```

At minimum, `frontend/.env.local` needs:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:8080
```

PostHog and Google Maps keys are **optional** for local work.

### 2. Backend + database (Docker)

```bash
docker compose up --build
```

API: http://localhost:8080  
Postgres: `localhost:5432` (credentials from `.env`)

### 3. Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

App: http://localhost:3000

### 4. Google sign-in (optional)

To test login, post deals, and likes, configure OAuth in `.env`:

- `GAUTH_CLIENT_ID` / `GAUTH_CLIENT_SECRET`
- `GAUTH_CLIENT_CALLBACK_URL=http://localhost:8080/api/auth/google/callback`
- Authorized redirect URI in Google Cloud Console must match the callback URL

Without OAuth, browsing and searching deals still works.

---

## Tests

```bash
# Backend (requires Docker for integration test)
cd backend && go test ./...

# Frontend
cd frontend && pnpm test
```

---

## Technical take-home

To get started: Fork the repository, implement your changes and push them to your repository, turn in your repository link for your application (**make sure your repo is PUBLIC**). You are also allowed to utilize and leverage AI tools but you will be questioned/judged on design implementations, code quality, system tradeoffs, etc.

**General rules**

- Prefer **free-tier** external services, but use as you'd like! You won't be docked for using a free-tier API; document API keys in `.env.example` (never commit
  real secrets).
- Google OAuth is already wired for sign-in; features that require auth should use the existing
  session flow.

---

#### Open-ended (full-stack)

Implement a new product feature to this application that is **end-to-end** (backend, frontend, and database), build it. This implementation should not take more than 5 hours.
---

## Assignment notes

Implement your take-home against the existing HTTP API used by the frontend (`/api/deal`,
`/api/business`, `/api/user`, etc.). Keep responses compatible with the Next frontend!
