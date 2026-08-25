# ARCHITECTURE — Port Ofis Kırtasiye

## 1. Style

A single Spring Boot backend serving a single Next.js frontend, backed by one PostgreSQL database. **No microservices, no API gateway, no message queue, no CQRS/hexagonal ceremony.** This is a small/medium business marketing + admin site. Every architectural choice below should be the simplest one that satisfies the requirement.

## 2. High-level diagram

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
│  frontend  │  — renders public pages (SSR/ISR) and the /admin SPA-style panel
└────────────┘
```

- **Browser → Next.js**: normal web traffic. Public pages (Ana Sayfa, Hizmetler, Ürünler, Baskı Merkezi, Kurumsal, İletişim) are server-rendered/statically-optimized by Next.js for SEO. `/admin/**` is rendered by Next.js but behaves as a client-side app (login gate, forms, tables) — no special SSR requirement there.
- **Browser → Spring Boot API directly**: the browser calls the backend directly over HTTP for *dynamic, interactive* calls that cannot be a build-time fetch: the contact form submit, and all `/admin` interactions (login, CRUD, listing). Next.js pages may also fetch from the backend at request/build time (server-side) to render public content with fresh data (SSR/ISR) — see §5.
- **Next.js → Spring Boot API**: server-side data fetching for public pages, and it is also fine (and expected) for the same public GET endpoints to be called client-side if a page needs client-side re-fetching (e.g. category filter on Ürünler page). The contract is identical either way — see `docs/API_CONTRACT.md`.
- **Spring Boot → PostgreSQL**: Spring Data JPA + Flyway-managed schema. One database, one schema, no sharding.

## 3. Backend

- Java 21, Spring Boot 3.x, Maven, Spring Data JPA, Bean Validation, PostgreSQL driver, Flyway.
- Single deployable JAR/container. Layering: `controller / service / repository / entity / dto / mapper / exception / config` (domain-based sub-packages are fine, e.g. `service/services`, `service/products` — engineer's call, not architecturally significant).
- **Stateless REST API.** No server-side sessions. Admin auth is JWT bearer-token based (see §6). This means the API can sit behind any number of frontend instances or a load balancer without sticky sessions — not that we need more than one instance in this phase.
- All persistence goes through Flyway-versioned SQL migrations (`V1__create_initial_schema.sql`, `V2__insert_initial_data.sql`, …). Hibernate `ddl-auto` must be `validate` or `none` in every environment — Flyway is the only source of schema truth.
- Global exception handling via one `@ControllerAdvice` producing the standard error model from `docs/API_CONTRACT.md`. This is the "single admin auth boundary" pattern extended to errors too: one place, not scattered try/catch.

## 4. Frontend

- Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion.
- Public pages: prefer Server Components with server-side `fetch()` to the backend for initial render (good SEO, good first paint for a marketing site), with `revalidate` (ISR) on the order of minutes, not `no-store`, since content (services/products) changes rarely and is admin-curated.
- `/admin/**`: Client Components. Holds the JWT in memory + `localStorage` (or an httpOnly-cookie pattern if the frontend engineer prefers — either is acceptable; see §6 note) and attaches it as `Authorization: Bearer <token>` on every `/api/admin/**` call.
- **Two environment variables drive API calls, split by where the fetch code runs — not by deployment environment:**
  - `NEXT_PUBLIC_API_BASE_URL` — the public, browser-facing base URL (e.g. `http://localhost:8080` in dev, `https://api.portofiskirtasiye.com.tr` in prod). Used by every Client Component fetch, and for any URL embedded in rendered HTML (metadata, structured data, canonical/OG URLs). It is `NEXT_PUBLIC_*`, so Next.js inlines it into client JS at build time — never put an internal-only/container-only address in it.
  - `API_BASE_URL_INTERNAL` — a **server-only** base URL (deliberately *not* `NEXT_PUBLIC_*`-prefixed, so Next.js never bundles it into client JS) used exclusively by server-side fetch code: Server Components (`page.tsx`/`layout.tsx` RSC data fetches), Route Handlers, `generateMetadata`, etc. It exists because in the Docker Compose topology the frontend container's own server-side process and the visitor's browser reach the backend through two different addresses (browser → published host port `localhost:8080`; frontend container → backend container, only reachable at the Compose service name `backend:8080` — see §7). One shared URL cannot be correct for both, so server-side code needs its own.
  - **Resolution rule** (implemented in the frontend's fetch helper, e.g. `src/lib/api.ts`): server-side fetch code resolves its base URL as `API_BASE_URL_INTERNAL ?? NEXT_PUBLIC_API_BASE_URL` — prefer the internal var, fall back to the public one when `API_BASE_URL_INTERNAL` is unset. Client-side fetch code always reads `NEXT_PUBLIC_API_BASE_URL` directly and never touches `API_BASE_URL_INTERNAL` (it isn't exposed to the client). This fallback means local, non-Docker `npm run dev` needs no second env var — server and browser reach the backend identically there, so the fallback alone is already correct. Only the Docker Compose deployment needs `API_BASE_URL_INTERNAL` actually set (to `http://backend:8080` — see §7).
  - Because it has no `NEXT_PUBLIC_*` prefix, `API_BASE_URL_INTERNAL` only needs to be present as a plain runtime environment variable on the running container — it does not need to be passed as a Docker build `ARG`/baked into the image the way `NEXT_PUBLIC_API_BASE_URL` does.

## 5. Browser-to-backend reachability & CORS

The browser calls the Spring Boot API **directly** (not proxied through a Next.js API route) for the contact form and all admin interactions. Consequences:

- The backend container/service must be network-reachable from the visitor's browser (in Docker Compose, its port is published to the host; in production, it sits on its own public subdomain/port, e.g. `api.portofiskirtasiye.com.tr`).
- The backend **must** enable CORS for the frontend's origin. Configure it from an environment variable (e.g. `CORS_ALLOWED_ORIGIN=http://localhost:3000` in dev, the real domain in prod) rather than a hardcoded value or `*`. Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`. Allowed headers must include `Authorization, Content-Type`.
- This is a deliberate simplicity choice for this phase over adding a Next.js proxy/BFF layer, which would be over-engineering for a site of this size.

## 6. Admin authentication (structured, minimal, extensible)

Goal: real backend implementation now, minimal, but with **one** boundary so a future upgrade (OAuth, multi-role, refresh tokens, 2FA) doesn't require rearchitecting.

- One `admin_users` table (id, username, password_hash, created_at). See `docs/DATABASE_SCHEMA.md`.
- `POST /api/admin/auth/login` verifies username/password (BCrypt) and issues a signed JWT (HS256), expiry 12 hours. No sessions, no server-side token store.
- Every `/api/admin/**` route (except `/api/admin/auth/login`) is protected by **one** Spring Security filter chain / `OncePerRequestFilter` that validates the bearer token. This is the single admin auth boundary — controllers never do their own ad-hoc "is this an admin" checks.
- **No hardcoded secrets.** The JWT signing key comes from an environment variable (e.g. `ADMIN_JWT_SECRET`). Because there is no user-facing registration flow in this phase, the *first* admin user is provisioned from environment variables at startup (e.g. `ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD`, hashed on first boot and inserted only if `admin_users` is empty — not baked into a Flyway migration file, which would commit a real or placeholder secret to source control). This keeps the door open to a real "create admin user" flow later without changing the auth boundary. These three env vars must be added to the root `.env.example` — flagged in this agent's final report since `analyst-architect` does not own that file.
- Frontend token storage (`localStorage` vs. httpOnly cookie) is a frontend implementation detail; either satisfies this contract as long as the token is sent as `Authorization: Bearer <token>`.

## 7. Deployment / Docker Compose overview

Three services, one shared Docker network, no orchestration beyond Compose:

| Service    | Image/build            | Port (host:container) | Depends on            |
|------------|-------------------------|------------------------|------------------------|
| `postgres` | `postgres:16-alpine`    | `5432:5432`            | —                      |
| `backend`  | build from `backend/`   | `8080:8080`            | `postgres` (healthy)   |
| `frontend` | build from `frontend/`  | `3000:3000`            | `backend` (started)    |

- `postgres` uses a named volume for data persistence and a healthcheck (`pg_isready`) so `backend` waits for a healthy DB before starting (Flyway runs automatically on backend startup against the healthy DB).
- `backend` reads DB connection info, `ADMIN_JWT_SECRET`, `ADMIN_DEFAULT_USERNAME`, `ADMIN_DEFAULT_PASSWORD`, and `CORS_ALLOWED_ORIGIN` from environment variables (populated from the root `.env` file / Compose `env_file`).
- `frontend` reads two API base URLs (see §4): `NEXT_PUBLIC_API_BASE_URL` (public/browser-facing — the host-published backend address, e.g. `http://localhost:8080`) at build **and** run time, and `API_BASE_URL_INTERNAL` at run time only, set to `http://backend:8080` (the Compose service name `backend`, its container port — never the host-published port) so the frontend container's own server-side fetches (SSR/RSC) reach the backend container directly instead of trying `localhost` inside the frontend container, where it doesn't resolve to the backend. This is what fixes the container-networking break described in `QA_REPORT.md` BUG-001.
- No reverse proxy / TLS termination is specified in this phase (out of scope for a docs-only deliverable); in production this is typically a hosting-provider or nginx concern layered on top without changing this diagram.
- Actual `docker-compose.yml` and `.env.example` contents are owned by the orchestrator, not by this document — the table above is the contract those files must satisfy.

## 8. What is explicitly out of scope this phase

- No cart/checkout/payment processing.
- No user-facing accounts/registration (only the single admin boundary above).
- No search engine/Elasticsearch, no caching layer (Redis), no CDN configuration.
- No multi-tenancy, no internationalization beyond Turkish content.
- No image upload/storage service — `imageUrl` fields are plain strings (the admin panel accepts a URL; an actual file-upload/object-storage pipeline is a future enhancement, not built now).
