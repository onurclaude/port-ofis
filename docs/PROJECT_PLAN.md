# PROJECT_PLAN — Port Ofis Kırtasiye

## 1. What this is

A corporate marketing + light admin-panel website for **Port Ofis Kırtasiye**, a stationery / digital printing / office-solutions business.

- **Location**: Eryaman Port AVM, Etimesgut / Ankara
- **Phone**: 0312 911 81 02
- **Domain**: portofiskirtasiye.com.tr
- **Services**: Kırtasiye, Dijital Baskı, Fotokopi/Çıktı, Sarf Malzemeleri, Toner/Kartuş, Oyuncak, Hediyelik, Kişiye Özel Baskı, Kupa Baskı, Kaşe, Kartvizit, Broşür, Kurumsal Baskı Çözümleri, Kurumsal Kırtasiye Tedariği.

This is a **small/medium business site**, not an enterprise platform. No microservices, no generic CMS, no speculative features. Every page's content (except static informational copy) is admin-editable through a real backend so the business can update it without a developer, but there is **no cart/checkout/online payment** in this phase.

## 2. Scope

### In scope (this phase)
- 6 public pages + 1 admin panel (§4).
- A Spring Boot REST API backing all dynamic content: services, product categories, products, contact messages, site settings.
- A single admin authentication boundary (JWT), minimal but structurally sound for future expansion.
- Docker Compose for local/production deployment of all three tiers.
- Full backend + frontend + integration test coverage per `docs/TEST_PLAN.md`.

### Explicitly out of scope
- Cart, checkout, online payment, order management.
- Customer accounts/registration (only the single admin login exists).
- Multi-language content (Turkish only).
- Image upload pipeline — images are referenced by URL, not uploaded through the admin panel.
- Search engine, caching layer, CDN, multi-instance scaling, microservices.
- Email/SMS notifications when a contact message arrives (admin checks the panel) — a plausible future enhancement, not built now.

## 3. User types

| Type | Description | Access |
|---|---|---|
| **Visitor** | Anyone browsing the public site. No login. | All 6 public pages; can submit the contact form. |
| **Admin** | Business staff managing content. One role, one boundary (see `docs/ARCHITECTURE.md` §6). | `/admin` panel: login, CRUD services/categories/products, view/triage contact messages, edit site settings. |

No other roles exist in this phase (no "editor" vs "owner" distinction) — deliberately, to avoid building permission machinery nobody asked for.

## 4. Pages

1. **Ana Sayfa** (`/`) — homepage, brand-forward introduction, pulls highlights from every other section.
2. **Hizmetler** (`/hizmetler`) — full service catalog (from `/api/services`).
3. **Ürünler** (`/urunler`) — product categories + filterable product listing (from `/api/categories`, `/api/products`).
4. **Baskı Merkezi** (`/baski-merkezi`) — dedicated page for the digital printing center's offerings.
5. **Kurumsal** (`/kurumsal`) — corporate/B2B solutions page with a "Kurumsal Teklif Al" CTA into the contact form.
6. **İletişim** (`/iletisim`) — address, phone, map, contact form (`POST /api/contact`).
7. **Admin panel** (`/admin`, `/admin/login`, `/admin/services`, `/admin/categories`, `/admin/products`, `/admin/messages`, `/admin/settings`) — internal tool, same visual system, less decorative.

Full per-page behavior is specified in `docs/FRONTEND_SPEC.md`.

## 5. Phases

1. **Phase 1 — Docs (this phase, owned by analyst-architect)**: `docs/**` — this plan, architecture, API contract, DB schema, frontend spec, user flows, test plan. Backend and frontend engineers implement from these documents **in parallel, without communicating with each other** — so every ambiguity must be resolved here, not left for them to guess/converge on independently.
2. **Phase 2 — Backend implementation** (owned by backend-engineer, `backend/**`): Spring Boot project, Flyway migrations (schema + seed data), entities/DTOs/mappers, controllers/services/repositories, validation, `GlobalExceptionHandler`, JWT admin auth filter, CORS config, backend test suite.
3. **Phase 3 — Frontend implementation** (owned by frontend-ui-engineer, `frontend/**`, in parallel with Phase 2): Next.js project, brand-matched design system, all 6 public pages + `/admin`, API integration layer, loading/error/empty states, responsive + accessibility pass, frontend test suite.
4. **Phase 4 — Integration & QA** (owned by qa-integration-engineer, `QA_REPORT.md` only): full contract-compliance testing, Docker Compose smoke test, the critical visitor→contact-form→admin E2E flow, bug reporting with severity/owner for the orchestrator to route back to backend/frontend/architecture.
5. **Phase 5 — Fix/verify loop**: orchestrator routes each `QA_REPORT.md` bug to the right owner; QA re-verifies; repeat until zero CRITICAL/HIGH bugs.

## 6. Backend tasks (Phase 2 summary — detail in `docs/API_CONTRACT.md` / `docs/DATABASE_SCHEMA.md`)

- Flyway `V1__create_initial_schema.sql`: `services`, `categories`, `products`, `contact_messages`, `site_settings`, `admin_users`.
- Flyway `V2__insert_initial_data.sql`: 6 services (exact list, §7), 6 categories, ≥2 products per category, 10 `site_settings` rows. **No** `admin_users` row in migrations (see §8).
- All 30 endpoints from `docs/API_CONTRACT.md` §15, exactly as specified (methods, paths, DTOs, status codes, validation, error shape).
- JWT-based admin auth: `POST /api/admin/auth/login`, one filter chain protecting `/api/admin/**`.
- `GlobalExceptionHandler` producing the standard error model for every failure case.
- CORS enabled for `NEXT_PUBLIC_API_BASE_URL`'s origin via env var.
- Test suite per `docs/TEST_PLAN.md` §2; `mvn test` and `mvn clean package` must both pass before reporting done.

## 7. Frontend tasks (Phase 3 summary — detail in `docs/FRONTEND_SPEC.md`)

- Next.js + TypeScript + Tailwind + shadcn/ui + Framer Motion, matching the black/gold brand in `references/brand/`.
- All 6 public pages + `/admin` (login-gated), each calling the real API — no hardcoded/mock content in the final build.
- Loading/error/empty states on every data-driven section (per `docs/FRONTEND_SPEC.md`).
- Contact form wired to `POST /api/contact` with client-side + server-error validation feedback.
- Responsive at 375/430/768/1024/1440+; accessibility basics (semantic HTML, focus states, alt text, labels, contrast, reduced-motion).
- SEO metadata + LocalBusiness structured data using the business facts in §1.
- `npm run lint` and `npm run build` must both pass clean before reporting done.

## 8. Integration tasks / cross-cutting concerns

- **Admin bootstrap credentials**: `ADMIN_DEFAULT_USERNAME`, `ADMIN_DEFAULT_PASSWORD`, `ADMIN_JWT_SECRET`, `CORS_ALLOWED_ORIGIN` must be added to the root `.env.example` and `docker-compose.yml` — these files are owned by the orchestrator, not by this agent or by backend/frontend; flagged here so it isn't dropped.
- **API base URL(s)**: two vars, per `docs/ARCHITECTURE.md` §4 — `NEXT_PUBLIC_API_BASE_URL` (public/browser-facing) and `API_BASE_URL_INTERNAL` (server-only, Docker-Compose-only, `http://backend:8080`) — must be set in `docker-compose.yml`/`.env.example` for the frontend service.
- **Docker Compose**: three services (`postgres`, `backend`, `frontend`) per `docs/ARCHITECTURE.md` §7 — owned by the orchestrator to wire up, but backend/frontend must each provide a working `Dockerfile`.

## 9. QA acceptance criteria (full detail in `docs/TEST_PLAN.md`)

The project is **not** considered done until all of the following hold:

1. `mvn clean test` and `mvn clean package` succeed in `backend/`.
2. `npm run lint` and `npm run build` succeed in `frontend/`, zero TypeScript errors.
3. `docker compose up --build` from repo root brings up all three services healthy; Flyway migrations complete; frontend can reach backend.
4. Every endpoint in `docs/API_CONTRACT.md` §15 behaves exactly as documented (status codes, DTO shapes, validation, error model) — verified in `QA_REPORT.md`.
5. **Critical E2E flow passes**: a visitor submits the İletişim contact form → row appears in `contact_messages` → the same message is visible (and markable as read) in the admin panel. This flow is release-blocking.
6. All 6 public pages + `/admin` render correctly and responsively at 375/430/768/1024/1440, no console errors, no broken links.
7. Zero CRITICAL and zero HIGH severity bugs open in `QA_REPORT.md`.

## 10. Seed data reference (also in `docs/DATABASE_SCHEMA.md` §7)

Services (exact, required): **Dijital Baskı, Kırtasiye, Sarf Malzemeleri, Kişiye Özel Baskı, Oyuncak & Hediyelik, Kaşe & Kurumsal Çözümler.**

## 11. Open questions / assumptions for the business owner or orchestrator to confirm

See the final report from this phase for the consolidated list (also inline where relevant in `docs/DATABASE_SCHEMA.md` §7.4 and `docs/ARCHITECTURE.md` §6).
