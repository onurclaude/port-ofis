# Port Ofis Kırtasiye — Full-Stack Web Sitesi

Port Ofis Kırtasiye (Eryaman Port AVM, Etimesgut / Ankara) için kurumsal tanıtım + admin panelli, gerçek çalışan bir full-stack web sitesi.

Kırtasiye, dijital baskı, sarf malzemeleri, kişiye özel baskı, oyuncak & hediyelik ve kurumsal çözümler alanlarındaki hizmet/ürün içeriği tamamen admin panelinden yönetilir; bu fazda online ödeme/sepet yoktur.

- **Telefon**: 0312 911 81 02
- **Web**: portofiskirtasiye.com.tr

## Screenshots

_(Ekran görüntüleri buraya eklenecek — homepage, hizmetler, ürünler, baskı merkezi, kurumsal, iletişim, admin paneli.)_

## Architecture

```
┌────────────┐        HTTPS/JSON         ┌──────────────────┐        JDBC        ┌──────────────┐
│  Browser   │  ───────────────────────▶ │  Spring Boot API │ ─────────────────▶ │  PostgreSQL  │
│ (visitor / │ ◀─────────────────────── │  (Java 21, :8080) │ ◀───────────────── │   (:5432)    │
│  admin)    │                           └──────────────────┘                     └──────────────┘
└─────┬──────┘
      │  HTML/RSC over HTTP
      ▼
┌────────────┐
│  Next.js   │  (TypeScript, Tailwind, :3000)
│  frontend  │  — public pages (SSR/ISR) + /admin panel
└────────────┘
```

- Next.js server-rendered public pages fetch from the backend server-side (SSR/ISR); the browser also calls the backend directly for the contact form and all `/admin` interactions.
- Single Spring Boot REST API, single PostgreSQL database, Flyway-versioned schema. No microservices, no API gateway, no message queue.
- Full detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Technologies

| Layer | Stack |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, shadcn/ui (Radix primitives), Framer Motion, Zod |
| Backend | Java 21, Spring Boot 3.5, Spring Data JPA, Spring Security (JWT via `jjwt`), Bean Validation, Flyway |
| Database | PostgreSQL 16 |
| Deployment | Docker Compose (`postgres` + `backend` + `frontend`) |

## Project structure

```
port-ofis/
├── references/brand/     # logo, kartvizit, tabela — brand identity reference
├── docs/                  # architecture, API contract, DB schema, frontend spec, test plan
├── backend/               # Spring Boot REST API
├── frontend/              # Next.js site + admin panel
├── docker-compose.yml
├── .env.example
├── QA_REPORT.md
└── README.md
```

## Requirements

- Docker + Docker Compose (recommended path — no local Java/Node/Postgres needed)
- For manual local development instead: Java 21, Node.js 20+, PostgreSQL 16

## Quick start (Docker Compose)

```bash
cp .env.example .env
# edit .env: set real values for ADMIN_JWT_SECRET, ADMIN_DEFAULT_PASSWORD, POSTGRES_PASSWORD
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Admin panel: http://localhost:3000/admin/login (credentials from `ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD`)

All three services (`postgres`, `backend`, `frontend`) have healthchecks; `backend` waits for a healthy `postgres` before starting (Flyway migrations run automatically on backend startup), and `frontend` waits for `backend`.

## Environment variables

Defined in `.env.example` (copy to `.env`, never commit the real file):

| Variable | Used by | Purpose |
|---|---|---|
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | postgres, backend | Database credentials |
| `ADMIN_JWT_SECRET` | backend | Signing key for admin JWTs — required, no default |
| `ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD` | backend | Bootstrap admin account, created once on first startup if `admin_users` is empty |
| `CORS_ALLOWED_ORIGIN` | backend | Origin allowed to call the API (the frontend's public URL) |
| `NEXT_PUBLIC_API_BASE_URL` | frontend | Public, browser-facing API base URL — used by all client-side fetches |
| `NEXT_PUBLIC_SITE_URL` | frontend | Public site URL, used for metadata/robots/sitemap |
| `API_BASE_URL_INTERNAL` | frontend (set directly in `docker-compose.yml`, `http://backend:8080`) | Server-only base URL for SSR/RSC fetches inside the Docker network — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §4 |

## Database (PostgreSQL + Flyway)

Schema and seed data are entirely Flyway-managed under `backend/src/main/resources/db/migration/`:

- `V1__create_initial_schema.sql` — `services`, `categories`, `products`, `contact_messages`, `site_settings`, `admin_users`
- `V2__insert_initial_data.sql` — 6 services, 6 categories, seed products, 10 site-settings rows (no admin user — that's bootstrapped from env vars at runtime, not committed to a migration)

Hibernate `ddl-auto` is `validate`/`none` everywhere — Flyway is the only source of schema truth. Full schema: [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md).

## Backend

```bash
cd backend
mvn clean test      # 76 tests — controller / service / repository / DTO layers
mvn clean package   # produces backend-0.0.1-SNAPSHOT.jar
mvn spring-boot:run # run locally against a local Postgres (needs matching env vars)
```

Layering: `controller / service / repository / entity / dto / mapper / exception / config`. Constructor injection, DTOs (never entities) on the wire, Bean Validation, one `GlobalExceptionHandler` for the standard error model. One JWT-protected filter chain guards every `/api/admin/**` route.

## Frontend

```bash
cd frontend
npm install
npm run dev     # local dev server, http://localhost:3000
npm run lint
npm run build
```

Public pages (`/`, `/hizmetler`, `/urunler`, `/baski-merkezi`, `/kurumsal`, `/iletisim`) are Server Components fetching from the backend with ISR; `/admin/**` is a client-rendered, JWT-gated panel (login, services/categories/products CRUD, contact message triage, site settings). No mock data ships in the production build — every dynamic section is backend-driven.

## API overview

30 endpoints total. Public (no auth): `GET /api/services`, `GET /api/categories`, `GET /api/products`, `POST /api/contact`, `GET /api/site-settings` (+ single-resource variants). Admin (JWT bearer, `POST /api/admin/auth/login` issues the token): full CRUD on `/api/admin/services`, `/api/admin/categories`, `/api/admin/products`, plus `/api/admin/contact-messages` (list/view/status update/delete) and `/api/admin/site-settings`. Every error response uses one standard shape (`timestamp`, `status`, `code`, `message`, `fieldErrors`). Full contract: [docs/API_CONTRACT.md](docs/API_CONTRACT.md).

## Admin panel

`/admin/login` → JWT stored client-side, attached as `Authorization: Bearer <token>` on every `/api/admin/**` call. A 401 from any admin call triggers logout + redirect to `/admin/login`. Panel covers: Services, Categories, Products, Contact Messages (mark read/unread, delete), Site Settings.

## Tests

- Backend: 76 tests (`mvn clean test`) — unit + Testcontainers-backed repository/integration tests against real PostgreSQL.
- Frontend: `npm run lint` (ESLint, zero warnings) + `npm run build` (TypeScript strict, zero errors).
- Full contract-compliance + Docker Compose integration + critical E2E flow (visitor submits contact form → row in `contact_messages` → visible in admin panel): see [QA_REPORT.md](QA_REPORT.md) — **0 CRITICAL / 0 HIGH / 0 MEDIUM / 0 LOW** bugs open.
- Test strategy detail: [docs/TEST_PLAN.md](docs/TEST_PLAN.md).

## Build

```bash
# full stack, one command, from repo root
docker compose up --build
```

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Homepage/Hizmetler/Ürünler render "şu anda görüntüleyemiyoruz" inside Docker | `API_BASE_URL_INTERNAL` not reaching the frontend container correctly, or `backend` not healthy yet — check `docker compose logs backend` and confirm `docker compose ps` shows `backend` as `healthy` before `frontend` starts. |
| `backend` container keeps restarting | Usually Postgres not ready yet or Flyway migration failure — check `docker compose logs backend`; `backend` is configured to wait for `postgres`'s healthcheck, but a bad `.env` DB credential will still fail the connection. |
| Admin login fails with correct credentials | Confirm `ADMIN_DEFAULT_USERNAME`/`ADMIN_DEFAULT_PASSWORD` in `.env` match what you're typing, and that this is the *first* boot (the bootstrap account is only created once, when `admin_users` is empty). |
| `401` on every `/api/admin/**` call from the frontend after a while | JWT expired (12h) — log in again. |
| CORS errors in the browser console | `CORS_ALLOWED_ORIGIN` in `.env` doesn't match the origin you're loading the frontend from. |
| Frontend `npm run build` fails on a fresh clone | Run `npm install` first; also confirm `NEXT_PUBLIC_API_BASE_URL` is set (empty string is a valid build-time default but every fetch will fail at runtime). |
