# TEST_PLAN — Port Ofis Kırtasiye

Scope discipline applies to tests too: cover what's real and asked for, not speculative edge cases for features that don't exist (no payment tests, no multi-tenant tests, etc.).

## 1. Test levels & ownership

| Level | Owner | Tooling (suggested, not mandated) | Command |
|---|---|---|---|
| Backend unit/integration | backend-engineer | JUnit 5, Spring Boot Test, Mockito, Testcontainers or H2 | `mvn test` |
| Backend build | backend-engineer | Maven | `mvn clean package` |
| Frontend lint/type/build | frontend-ui-engineer | ESLint, TypeScript, Next.js build | `npm run lint`, `npm run build` |
| Frontend component/unit | frontend-ui-engineer | Jest/React Testing Library or Vitest (engineer's choice) | per `package.json` |
| Full-stack / E2E / Docker | qa-integration-engineer | manual + scripted HTTP calls, `docker compose up --build` | see `docs/PROJECT_PLAN.md` §9 |

## 2. Backend test coverage requirements

### 2.1 Entity/repository layer
- Each entity (`Service`, `Category`, `Product`, `ContactMessage`, `SiteSetting`, `AdminUser`) persists and loads correctly.
- Unique constraints enforced: duplicate `slug` on services/categories/products, duplicate `key` on site_settings, duplicate `username` on admin_users all throw a constraint violation the service layer translates to `409 CONFLICT`.
- `products.category_id` FK: inserting a product with a non-existent `categoryId` is rejected at the service/validation layer (`400`, not a raw DB error); deleting a category with dependent products is rejected (`409`).

### 2.2 Service layer
- Business logic per entity: create/update/delete/list/get-by-id/get-by-slug, including the "public list only returns `isActive = true`" rule for services/categories/products vs. "admin list returns everything."
- Pagination math for products (admin + public) and admin contact messages: correct `totalElements`/`totalPages`, `size` clamped to 100.
- Contact message status transition (`NEW` → `READ`).
- Site settings: `PUT` replaces all 10 known keys; unknown keys in a request are rejected or ignored consistently (engineer's documented choice, but must be deterministic and covered by a test).
- Admin bootstrap: on startup with an empty `admin_users` table, exactly one admin user is created from `ADMIN_DEFAULT_USERNAME`/`ADMIN_DEFAULT_PASSWORD`, password stored as a BCrypt hash (never plaintext); on a second startup, no duplicate is created.

### 2.3 Controller / API layer (per `docs/API_CONTRACT.md`)
For **every** endpoint in §15 of the API contract:
- Correct HTTP method/path/status code on success.
- Response body matches the documented DTO shape exactly (field names, types, nesting).
- Every validation rule in the contract is tested with at least one failing case, asserting `400 VALIDATION_ERROR` and the correct `fieldErrors[].field`.
- `404 NOT_FOUND` for unknown id/slug on every detail/update/delete endpoint.
- `409 CONFLICT` for every documented conflict case (duplicate slug/key, category-with-products delete).
- Malformed JSON / bad query params → `400 BAD_REQUEST`.
- Error response body always matches the standard error model exactly (`timestamp`, `status`, `code`, `message`, `fieldErrors`).

### 2.4 Auth
- `POST /api/admin/auth/login`: correct credentials → `200` + valid JWT; wrong username, wrong password, and missing fields all → appropriate `401`/`400`, with the wrong-username and wrong-password cases returning the *same* message (no user enumeration).
- Every `/api/admin/**` route (except login) rejects: no `Authorization` header, malformed header, expired token, tampered/invalid-signature token — all `401 UNAUTHORIZED`.
- A valid token from login successfully authorizes at least one call to each admin sub-resource (services/categories/products/contact-messages/site-settings) — proving the single filter chain covers all of them, not just some.

### 2.5 CORS
- Preflight/actual request from the configured `CORS_ALLOWED_ORIGIN` succeeds; response includes the expected CORS headers.

### 2.6 Migrations
- Flyway migrations apply cleanly on a fresh database (`mvn test`/Testcontainers should exercise this every run).
- After `V2__insert_initial_data.sql`, the database contains exactly the 6 required services (by slug), the 6 seed categories, seed products, and all 10 `site_settings` keys.

## 3. Frontend test coverage requirements

### 3.1 Build/lint/type safety
- `npm run lint`: zero errors.
- `npm run build`: succeeds, zero TypeScript errors.
- No `console.error`/`console.warn` noise from React in normal page loads (dev console check during manual/QA pass).

### 3.2 Per-page (all 6 public pages + `/admin/**`)
- Renders without crashing given a real backend response.
- **Loading state**: shown while the relevant API call(s) are in flight (see `docs/FRONTEND_SPEC.md` for which call per page).
- **Empty state**: shown when an API call succeeds with zero items (e.g. a product category with no products).
- **Error state**: shown when an API call fails (network error or non-2xx) — never a blank page or an infinite spinner.
- All internal links (navbar, footer, in-page CTAs) resolve to real routes — no 404s.
- Responsive layout verified at 375, 430, 768, 1024, 1440px — no horizontal overflow, no clipped/overlapping content, mobile nav (hamburger menu) opens/closes and its links work.

### 3.3 Contact form (İletişim page) — highest-priority frontend test
- Client-side validation blocks submit with empty required fields / invalid email, shows inline messages matching the rules in `docs/API_CONTRACT.md` §7.1.
- Successful submit: loading state shown during the call, form clears, exact success message displayed (`docs/USER_FLOWS.md` Flow 2 step 5).
- Server-side validation failure (simulate a `400` response): field-level errors rendered against the right fields.
- Network/server error (simulate a `500`/timeout): generic error message shown, typed input preserved, submit re-enabled.

### 3.4 Admin UI
- Unauthenticated access to any `/admin/*` route (other than `/admin/login`) redirects to login.
- Login: success redirects into the panel and stores the token; failure shows the inline error, doesn't store a token.
- Each CRUD screen (services/categories/products): list renders real data; create/edit forms validate client-side and surface server-side field errors; delete requires confirmation; a `409` on delete (category with products) surfaces the API's message, not a generic failure.
- Contact messages screen: lists real messages, unread indicator matches `status`, marking as read calls the `PATCH` endpoint and updates the UI.
- Site settings screen: pre-fills from `GET`, submits full object via `PUT`, shows validation errors inline.
- Session expiry (simulate a `401` on any admin call): user is logged out and redirected to login with an explanatory message.

### 3.5 Accessibility (spot checks, not a full audit)
- All interactive elements reachable and operable by keyboard (tab order, visible focus states).
- Form fields have associated labels.
- Images have meaningful `alt` text (or empty `alt` for decorative images).
- Color contrast of text against backgrounds meets at least WCAG AA for body text, given the black/gold palette.
- `prefers-reduced-motion` is respected by Framer Motion animations.

## 4. Integration / E2E (owned by qa-integration-engineer, reported in `QA_REPORT.md`)

### 4.1 Docker Compose smoke test
```
docker compose up --build
```
Verify: `postgres` reports healthy; `backend` starts and completes Flyway migrations without error; `frontend` starts and successfully fetches from `backend` (no CORS errors in browser console); all 6 public pages load with real (seeded) data; `/admin` reachable and login works with the bootstrap credentials.

### 4.2 API contract compliance
Exercise every endpoint in `docs/API_CONTRACT.md` §15 against the running backend (e.g. via `curl`/HTTP client scripts), confirming status codes, response shapes, and error cases match the contract exactly — this is independent verification on top of the backend's own tests in §2.3.

### 4.3 Critical E2E flow (release-blocking — must pass, per `docs/USER_FLOWS.md` Flow 2)
1. Submit the İletişim contact form as a real browser user against the running stack.
2. Confirm `201` response and the exact success message shown.
3. Query the database directly (or via `GET /api/admin/contact-messages`) and confirm the row exists with matching field values and `status = 'NEW'`.
4. Log into `/admin` with bootstrap credentials, navigate to the messages screen, confirm the message is visible.
5. Mark it read; confirm `status` becomes `READ` both in the UI and via a direct API/DB check.

### 4.4 Regression pass
After any bug fix, QA re-runs the *full* relevant suite (not just the fixed case) before flipping a `QA_REPORT.md` bug to `FIXED`/`VERIFIED`.

## 5. QA acceptance criteria (release gate)

The project is ready to ship only when **all** of the following are true:

1. `mvn clean test` and `mvn clean package` pass in `backend/`.
2. `npm run lint` and `npm run build` pass in `frontend/`, zero TypeScript errors.
3. `docker compose up --build` succeeds per §4.1.
4. Every endpoint matches `docs/API_CONTRACT.md` per §4.2.
5. The critical E2E flow (§4.3) passes.
6. All 6 public pages + `/admin` are verified responsive at 375/430/768/1024/1440 with no console errors and no broken links.
7. Zero **CRITICAL** and zero **HIGH** severity bugs remain **OPEN** in `QA_REPORT.md`. MEDIUM/LOW bugs may ship with the orchestrator's explicit sign-off.
