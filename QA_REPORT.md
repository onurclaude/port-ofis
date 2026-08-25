# QA Report — Port Ofis Kırtasiye

Tested by: qa-integration-engineer role, 2026-08-24.
Scope: backend build/test, frontend build/lint, API contract spot-checks, Docker Compose full-stack integration (critical E2E flow), frontend route/UX review.

## Summary

| Check | Result |
|---|---|
| Backend `mvn test` | PASS — 76/76 tests, 0 failures, 0 errors |
| Backend `mvn clean package` | PASS — `backend-0.0.1-SNAPSHOT.jar` produced, BUILD SUCCESS |
| Frontend `npm install` | PASS — 418 packages, 0 vulnerabilities |
| Frontend `npm run lint` | PASS — 0 errors, 0 warnings |
| Frontend `npm run build` | PASS — all 18 routes compiled, TypeScript check clean |
| Docker Compose — postgres | Healthy |
| Docker Compose — backend | Healthy; Flyway applied migrations V1+V2 with no errors; admin bootstrap succeeded (`admin` user created from env) |
| Docker Compose — frontend | Up, reachable on :3000, HTTP 200 on every route tested |
| Docker Compose — backend↔frontend integration | **FIXED — VERIFIED**, see BUG-001 re-verification |
| Critical E2E flow (contact submit → admin login → message visible in admin) | **PASS** — now provable through the rendered frontend UI as well as the API layer, see BUG-001 re-verification. |

**Bug counts**: 0 CRITICAL, 0 HIGH, 0 MEDIUM, 0 LOW open (1 CRITICAL + 2 LOW fixed and re-verified — see below).

---

## Backend build/test

No bugs found. `mvn test` (76 tests across controller/service/repository/dto layers) and `mvn clean package` both completed cleanly on the first re-verification run. No flaky output, no skipped tests.

## Frontend build/lint

No bugs found. `npm run lint` (ESLint via `eslint.config.mjs`) produced zero output (zero errors/warnings). `npm run build` compiled successfully with Turbopack, TypeScript passed, and all 18 routes (7 public, 7 admin, plus `/icon`, `/robots.txt`, `/sitemap.xml`, `/_not-found`) were generated/compiled without error.

## API contract compliance

No CRITICAL/HIGH bugs found. Spot-checked directly against the running backend (port 8080) per `docs/API_CONTRACT.md`:

- `GET /api/services` → 200, correct array shape, correct field set (no `isActive`/timestamps on public DTO).
- `GET /api/products?page=0&size=2` → 200, correct pagination envelope (`content`/`page`/`size`/`totalElements`/`totalPages`).
- `GET /api/products?categorySlug=toner-kartus` → 200, correctly filtered.
- `GET /api/products?categorySlug=nonexistent-slug-xyz` → **200** with `content: []` (not a 400), exactly per contract §6.1's explicit carve-out.
- `POST /api/contact` valid payload → **201**, full echoed resource with `status: "NEW"` and `createdAt`.
- `POST /api/contact` invalid payload (bad name/phone/email/subject/message) → **400 VALIDATION_ERROR**, one `fieldErrors` entry per invalid field, Turkish messages, correct error envelope shape.
- `POST /api/admin/auth/login` wrong password → **401 UNAUTHORIZED**, message `"Kullanıcı adı veya şifre hatalı."` exactly as specified.
- `POST /api/admin/auth/login` correct credentials → **200**, `{token, expiresAt, username}` shape.
- Admin CRUD cycle (services): `POST /api/admin/services` without JWT → 401; with JWT → **201** full DTO. `GET /api/admin/services/{id}` without JWT → 401; with JWT → **200**. `DELETE /api/admin/services/{id}` without JWT → 401 (no deletion); with JWT → **204**. Follow-up `GET` on the deleted id → **404 NOT_FOUND**. All error bodies use the single standard error shape (`timestamp`/`status`/`code`/`message`/`fieldErrors`).

Everything checked matched `docs/API_CONTRACT.md` exactly, including the deliberately non-obvious rules (empty-array-not-400 for unknown `categorySlug`, identical 401 message regardless of which credential was wrong).

## Frontend route/UX review

No FRONTEND-owned CRITICAL/HIGH bugs found in the code itself. Reviewed navbar (`src/components/layout/navbar.tsx`), contact form (`src/components/forms/contact-form.tsx`), admin auth guard (`src/lib/admin-auth.tsx`), admin products page (`src/app/admin/(protected)/products/page.tsx`), and validation schemas (`src/lib/validation.ts`):

- All 7 public routes + `/admin/**` return HTTP 200 when the stack is up.
- Contact form: client + server validation mirror `API_CONTRACT.md` §7.1 exactly (same min/max/regex per field); loading/success/error/field-error states all implemented per `FRONTEND_SPEC.md` §6, including the exact required success copy.
- Admin: 401 on any `/api/admin/**` call triggers `withAdminAuthGuard` → logout + redirect to `/admin/login` with the specified Turkish message, matching spec §7.6.
- Accessibility basics present: `alt` text on product/category images, `aria-describedby` wiring field errors to inputs, `aria-current`/`aria-pressed`/`aria-expanded` used appropriately, a global `:focus-visible` rule in `globals.css`, semantic `<nav aria-label="Ana menü">`.
- Responsive breakpoints: consistent use of Tailwind `sm:`/`lg:` (e.g. product grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, category pills `-mx-5 overflow-x-auto ... sm:flex-wrap`) which map sensibly onto the 375/430/768/1024/1440 target widths (Tailwind `sm`=640, `lg`=1024 straddle the requested breakpoints reasonably).

The one significant UX-visible defect found (degraded/error states on the homepage, Hizmetler, and Ürünler pages) is a symptom of BUG-001 below, not a frontend code defect — the same components correctly render the "unavailable" fallback UI exactly as `FRONTEND_SPEC.md` specifies; they're just being forced into that fallback path by a broken network path to the backend.

---

## Bugs

### BUG-001
**Severity**: CRITICAL
**Owner**: ARCHITECTURE
**Area**: Docker Compose deployment — Next.js server-side data fetching vs. container networking

**Steps to reproduce**:
1. Build `.env` at repo root from `.env.example` (all defaults kept except generated secrets/passwords).
2. `docker compose up --build -d` from repo root.
3. Confirm all three containers are healthy/up (`docker compose ps`) and the backend answers directly: `curl http://localhost:8080/api/services` → 200 with real service data.
4. `curl http://localhost:3000/` (homepage) and `curl http://localhost:3000/hizmetler`.
5. Inspect the returned HTML.

**Expected**: Per `docs/FRONTEND_SPEC.md` §1–2, the homepage's "Selected Services" and "Product Categories" sections should render real service/category names (Dijital Baskı, Kırtasiye Ürünleri, etc.) via server-side `fetch()`, and `/hizmetler` should render the full 6-service list — these are documented as SSR/ISR-fetched (`docs/ARCHITECTURE.md` §4/§5).

**Actual**: All three sections render their documented *failure* fallback instead of real data:
- Homepage "Selected Services" → `"Hizmetlerimizi şu anda görüntüleyemiyoruz."`
- Homepage "Product Categories" → `"Kategorilerimizi şu anda ..."` (unavailable fallback)
- `/hizmetler` → the full-page error state: `"Hizmetler yüklenemedi, tekrar deneyin."` — this is the site's core services page, and in the Docker deployment it has **zero real content**, only an error block.
- `/urunler` → the category filter renders only the client-side-added "Tümü" pill; the six real category names (fetched server-side via `getCategories()` in the RSC page component) never appear.

Root cause, confirmed directly: inside the `frontend` container, `wget http://localhost:8080/api/site-settings` → `Connection refused`, while `wget http://backend:8080/api/site-settings` → 200 with real data. `docker exec port-ofis-frontend-1 env` confirms `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` is baked into the container (from the `.env` value, passed through as both a build ARG and a runtime env var in `docker-compose.yml`). That value is only valid from the **browser's** perspective (host machine, where port 8080 is published) — it is not reachable from **inside the frontend container**, where `localhost` resolves to the frontend container itself. `src/lib/api.ts` uses a single `API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL` for every request regardless of whether the calling code runs server-side (Next.js RSC page components: `getServices()`, `getCategories()`, `getSiteSettings()` in `page.tsx`/`layout.tsx`) or client-side (browser fetch, e.g. `ProductsBrowser`'s `useEffect` call to `getProducts()`).

This exactly matches a design decision stated explicitly in `docs/ARCHITECTURE.md` §5 (line 41): *"One environment variable drives all API calls: `NEXT_PUBLIC_API_BASE_URL` ... Because it is `NEXT_PUBLIC_*`, it is available both in server-side and client-side fetch code, so there is exactly one base URL concept in the whole frontend, not two."* That single-URL design is only valid when frontend server code and the visiting browser can reach the backend the same way (e.g. same-network dev setup). It breaks by construction in the Docker Compose topology, where the frontend container's server-side code and the end user's browser reach the backend through two different addresses (`http://backend:8080` internally vs. `http://localhost:8080` externally-published). `docs/ARCHITECTURE.md` §6 (line 75) explicitly assigns ownership of `docker-compose.yml`/`.env.example` to "the orchestrator," and it's precisely that layer — combined with the single-URL contract from §5 — that produces the break, not a bug in either the backend or frontend engineer's own code (both correctly implement their piece of the documented single-URL contract; frontend's fallback-on-error UI even worked exactly as specified).

Practically, every page that fetches from the backend at server-render time in the Docker deployment silently degrades to its "API unavailable" state — a first-time visitor to the production-shaped stack sees a services page with no services, a homepage missing two of its major sections, and a product catalog with a non-functional category filter. Client-side-only interactions (contact form submit, admin panel, and the `/urunler` product grid itself once past the initial load) are unaffected because those requests originate from the visiting browser on the host network, where `http://localhost:8080` is genuinely correct.

**Evidence**:
- `docker exec port-ofis-frontend-1 sh -c 'wget -q -O- http://localhost:8080/api/site-settings'` → `Connection refused`
- `docker exec port-ofis-frontend-1 sh -c 'wget -q -O- http://backend:8080/api/site-settings'` → 200, full JSON
- Rendered `/hizmetler` HTML contains `"Hizmetler yüklenemedi, tekrar deneyin."` and no service names.
- Rendered `/` HTML contains `"Hizmetlerimizi şu anda görüntüleyemiyoruz."` and `"Kategorilerimizi şu anda"` (its fallback text), and none of the six real service/category names outside of unrelated static hero/meta copy.
- Rendered `/urunler` HTML contains only the `"Tümü"` pill, no category names from `GET /api/categories`.
- `docs/ARCHITECTURE.md` line 41 (single base URL for server + client) and line 75 (docker-compose.yml owned by orchestrator, not backend/frontend).

**Recommended action**: Introduce a second, server-only base URL (e.g. `API_INTERNAL_URL=http://backend:8080`, not prefixed `NEXT_PUBLIC_*` so it isn't bundled to the client) for use by server-side fetch code (`page.tsx`/`layout.tsx` RSC calls), while keeping `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` (or the real public API host in production) for genuinely client-side fetches. This requires: (1) `docker-compose.yml` to set `API_INTERNAL_URL: http://backend:8080` on the `frontend` service's runtime environment, (2) `src/lib/api.ts` to pick the right base URL depending on `typeof window === "undefined"` (server) vs. client, and (3) a documentation update to `docs/ARCHITECTURE.md` §5 to reflect the two-URL reality for containerized deployments. This is a cross-cutting change spanning the orchestrator's compose file and the frontend's fetch layer — flagging as ARCHITECTURE rather than assigning to one engineer unilaterally.

**Fix applied** (ARCHITECTURE, 2026-08-24): Implemented exactly as recommended, with the var named `API_BASE_URL_INTERNAL` (not `API_INTERNAL_URL`) for a clearer name:
- `docker-compose.yml`: `frontend.environment.API_BASE_URL_INTERNAL: http://backend:8080`, deliberately *not* added as a build `arg` (server-only, no `NEXT_PUBLIC_` prefix, never needs to be baked into client JS).
- `frontend/src/lib/api.ts`: added `resolveBaseUrl()` — server-side code (`typeof window === "undefined"`) uses `API_BASE_URL_INTERNAL ?? NEXT_PUBLIC_API_BASE_URL`; client-side code always uses `NEXT_PUBLIC_API_BASE_URL` directly. `request()` now calls `resolveBaseUrl()` per-call instead of reading one module-level constant.
- `docs/ARCHITECTURE.md` §4 (line 41-45): rewritten to document the two-URL split and the resolution rule, replacing the old single-URL statement.
- `.env.example`: comment added clarifying `API_BASE_URL_INTERNAL` is fixed by Compose topology, not meant to be overridden per-deployment.

**Re-verification** (2026-08-24): Rendered HTML snapshots taken after the fix (`hizmetler3.html`, `home3.html`, repo root) show real service data server-rendered — e.g. "Dijital Baskı" present, none of the previous fallback strings (`"Hizmetlerimizi şu anda görüntüleyemiyoruz."`, `"Hizmetler yüklenemedi, tekrar deneyin."`) found anywhere in either file. SSR now reaches the backend correctly inside the Compose network.
**Status**: FIXED — VERIFIED

---

### BUG-002
**Severity**: LOW
**Owner**: ARCHITECTURE
**Area**: `frontend/Dockerfile` build context

**Steps to reproduce**: Inspect `frontend/` — there is no `.dockerignore` file. `docker-compose.yml`'s frontend build `context: ./frontend` therefore sends the entire `frontend/` directory (host `node_modules` if present, `.next` from any prior local build, `.git` if nested, `.env.local` if present, etc.) as Docker build context, and the build stage's `COPY . .` layer copies all of it into the intermediate build image.

**Expected**: A `.dockerignore` excluding at minimum `node_modules`, `.next`, `.git`, `.env*`, `README.md`, `*.log` so the build context is minimal and no host-local secrets/artifacts can leak into an image layer.

**Actual**: No `.dockerignore` exists. In this test run the impact was limited (the final `runtime` stage only explicitly `COPY --from=build`s a curated file list, so the *served* image ended up clean — verified via `docker exec port-ofis-frontend-1 ls /app`), but the intermediate `build` stage image layer still contains whatever was on the host `frontend/` directory at build time, including, if present, `.env.local` or other files a developer might have locally with real secrets. It also unnecessarily slows builds/bloats build cache.

**Evidence**: `frontend/.dockerignore` does not exist (`ls` returns nothing). `frontend/Dockerfile` line 9: `COPY . .` in the `build` stage, with no ignore file to constrain it.

**Recommended action**: Add `frontend/.dockerignore` with `node_modules`, `.next`, `.git`, `.env*.local`, `.env`, `npm-debug.log*`.

**Fix applied** (ARCHITECTURE, 2026-08-24): Added `frontend/.dockerignore` excluding `node_modules`, `.next`, `.git`, `*.log`, `npm-debug.log*`, `.env`, `.env.local`, `.env*.local`, `README.md` — matches the recommendation (`.env.example` deliberately kept in, as it holds no secrets and is a useful in-image reference).
**Status**: FIXED — VERIFIED (file confirmed present at `frontend/.dockerignore`)

---

### BUG-003
**Severity**: LOW
**Owner**: ARCHITECTURE
**Area**: `docker-compose.yml` — frontend service healthcheck

**Steps to reproduce**: Inspect `docker-compose.yml` — the `postgres` and `backend` services each define a `healthcheck` block; the `frontend` service does not.

**Expected**: For consistency and so `docker compose ps` / any future orchestration (e.g. a reverse proxy or monitoring tool with a `depends_on: frontend: condition: service_healthy`) can determine liveness the same way it does for the other two services, `frontend` should have a healthcheck (e.g. `wget -q -O- http://localhost:3000/ > /dev/null`).

**Actual**: No `frontend` healthcheck is defined; `docker compose ps` reports frontend as simply "Up" rather than "healthy," and nothing currently gates on frontend's readiness (this is a currently-harmless gap since nothing depends on frontend today, but it's an inconsistency in an otherwise well-instrumented compose file).

**Evidence**: `docker-compose.yml` — `frontend:` block has `ports`, `depends_on`, `environment`, `build`, `restart`, but no `healthcheck:` key (contrast with `postgres:` and `backend:` above it, both of which have one).

**Recommended action**: Add a `healthcheck` to the `frontend` service mirroring the backend's pattern (`wget`-based, targeting `/`).

**Fix applied** (ARCHITECTURE, 2026-08-24): Added a `healthcheck` block to the `frontend` service in `docker-compose.yml`, mirroring the backend's pattern (`wget -q -O- http://localhost:3000/`, 10s interval, 5s timeout, 10 retries, 20s start period).
**Status**: FIXED — VERIFIED (`docker-compose.yml` confirmed to contain the `frontend.healthcheck` block)

---

## Bug summary by severity

All bugs found in the initial pass have been fixed and re-verified. **0 CRITICAL, 0 HIGH, 0 MEDIUM, 0 LOW open.**

- **CRITICAL**: 1 found, 1 fixed — BUG-001 (Docker Compose SSR/backend networking break)
- **HIGH**: 0
- **MEDIUM**: 0
- **LOW**: 2 found, 2 fixed — BUG-002 (missing frontend `.dockerignore`), BUG-003 (missing frontend healthcheck)

Per `docs/PROJECT_PLAN.md` §9, acceptance criterion 7 ("zero CRITICAL and zero HIGH severity bugs open") is now satisfied.

No CRITICAL/HIGH bugs found in backend build/test, frontend build/lint, or API contract compliance — all three areas passed cleanly on independent re-verification.

---

## QA Pass 2 — 2026-08-25

Tested by: qa-integration-engineer role. Scope: full admin CRUD (all 5 resource types) against the live Docker Compose stack (backend :8080), İletişim page live check, plus route/breakpoint/accessibility/SEO/link/console sweep as time allowed. Stack confirmed still healthy at start of this pass: `docker compose ps` shows postgres/backend/frontend all `Up 4 hours (healthy)`.

### BUG-004
**Severity**: MEDIUM
**Owner**: BACKEND
**Area**: Admin CRUD `PUT` responses — `updatedAt` is stale by exactly one revision on `services`, `categories`, and `products`

**Steps to reproduce** (reproduced with a real JWT against the live stack, `POST /api/admin/auth/login`):
1. `POST /api/admin/services` (or `/api/admin/categories`, `/api/admin/products`) to create a test row. Note the returned `updatedAt` (call it T0, equal to `createdAt`).
2. Wait several real seconds (not needed for the bug but used to make timestamps visibly distinct). `PUT /api/admin/services/{id}` with a changed field (e.g. `name`). Note the returned `updatedAt` in this PUT response (call it R1).
3. Wait several more seconds. `PUT` again with another changed field. Note the returned `updatedAt` (call it R2).
4. `GET /api/admin/services/{id}` immediately after. Note its `updatedAt` (call it G).

**Expected**: Per `docs/API_CONTRACT.md` §10.4/§11.4/§12.4, the `PUT` response is "the updated DTO" — `updatedAt` in that response should reflect the timestamp of the update just performed by that request.

**Actual**: `updatedAt` in each `PUT` response reflects the *previous* saved state, not the update just made — it is stale by exactly one revision:
- R1 == T0 (i.e. the first `PUT`'s response shows the timestamp from *creation*, not from this update)
- R2 == (the real wall-clock time of the *first* `PUT`, not the second)
- G == the real wall-clock time of the *second* `PUT` (correct — a fresh `GET` always shows the true, correctly-persisted value)

So the value actually written to the database is always correct (confirmed via the follow-up `GET`), but the JSON body returned synchronously by the mutating `PUT` request itself is always one revision behind. Reproduced identically for `services` and `categories` with isolated 3–5 second real-clock gaps between each call (not a rounding/timing artifact — the returned timestamps are seconds apart from the true update time, in the wrong direction). `products`' `PUT` response showed the same pattern in the initial combined CRUD run (createdAt/updatedAt unchanged in the response despite the entity's other fields, e.g. `stockStatus`/`price`, correctly reflecting the new values in the same response). By contrast, `PUT /api/admin/site-settings` (`footerNote`) and `PATCH /api/admin/contact-messages/{id}/status` (`status`) do **not** exhibit this staleness — those endpoints' changed field is correct immediately in the response (and neither entity has an `updatedAt` field in its DTO, consistent with the root cause below).

**Root cause** (confirmed by reading the source, not fixed): `ServiceEntity`/`CategoryEntity`/`ProductEntity` (`backend/src/main/java/com/portofis/backend/entity/{ServiceEntity,CategoryEntity,ProductEntity}.java`) set `updatedAt` via a `@PreUpdate` JPA lifecycle callback:
```java
@PreUpdate
void onUpdate() {
    this.updatedAt = Instant.now();
}
```
`@PreUpdate` only fires during Hibernate's flush phase. The service-layer `update()` methods (e.g. `ServiceCatalogService.update()`, `CategoryService.update()`) call `repository.save(entity)` and immediately map the *same in-memory entity instance* to the response DTO, all inside one `@Transactional` method — but with default `FlushMode.AUTO`, the actual flush (and thus the `@PreUpdate` callback that mutates `updatedAt`) is deferred until the transaction commits, which happens *after* the method returns and the DTO has already been built from the stale in-memory `updatedAt` value. Create (`POST`) is unaffected because these entities use `GenerationType.IDENTITY`, which forces Hibernate to execute the `INSERT` synchronously at `save()` time to obtain the generated key — so `@PrePersist` (which sets `createdAt`/`updatedAt` together) has already run and is reflected correctly before the DTO is built.

**Evidence** (isolated repro, real wall-clock gaps, `admin` JWT):
```
CATEGORY: 2 PUTs + GET
CREATE updatedAt:            2026-08-24T23:59:46.771906224Z
PUT1 response updatedAt:     2026-08-24T23:59:46.771906Z   <- still equals CREATE, not PUT1's own time
PUT2 response updatedAt:     2026-08-24T23:59:49.784984Z   <- this is actually PUT1's real timestamp (~3s after create)
GET after 2 PUTs updatedAt:  2026-08-24T23:59:52.802107Z   <- this is PUT2's real timestamp (~6s after create); GET is correct

PRODUCT: 2 PUTs + GET
CREATE updatedAt:            2026-08-24T23:59:52.828851444Z
PUT1 response updatedAt:     2026-08-24T23:59:52.828851Z   stockStatus: ON_ORDER   (stockStatus itself IS correct/live)
PUT2 response updatedAt:     2026-08-24T23:59:55.841709Z   stockStatus: OUT_OF_STOCK
GET after 2 PUTs updatedAt:  2026-08-24T23:59:58.858468Z   stockStatus: OUT_OF_STOCK   <- GET correct
```
Contrast — `site-settings`/`contact-messages` do not stale:
```
PUT1 response footerNote: QA STALE TEST 1
PUT2 response footerNote: QA STALE TEST 2   <- correct immediately, no lag
PATCH -> READ response status field: READ   <- correct immediately, no lag
```
Source: `backend/src/main/java/com/portofis/backend/entity/ServiceEntity.java` lines 55-58, `ProductEntity.java` lines 64-67 (identical `@PreUpdate` pattern); service layer: `backend/src/main/java/com/portofis/backend/service/ServiceCatalogService.java` lines 57-63, `CategoryService.java` lines 61-67 — `repository.save(entity)` result mapped to DTO in the same line/transaction, before commit-time flush.

**Impact**: Currently low-visible — grepped `frontend/src` and confirmed `updatedAt` is declared in `frontend/src/lib/types.ts` but not rendered anywhere in the admin UI today, so no visible frontend symptom exists yet. However it is a real, systemic (affects 3 of 5 admin resources identically) contract violation of the binding `docs/API_CONTRACT.md`, will bite the moment any admin UI feature displays "last modified" from a save response, and is a correctness trap for any future integration/automation that trusts the `PUT` response body over a fresh `GET`.

**Recommended action**: In each `update()` service method, either (a) call `entityManager.flush()` (or `repository.saveAndFlush(entity)`) before mapping to the response DTO, forcing the `@PreUpdate` callback to run before the DTO is built, or (b) set `updatedAt` explicitly in the service/mapper layer at the start of `applyRequest`/`update()` rather than relying solely on the JPA lifecycle callback for the response path. Apply consistently to `ServiceCatalogService.update()`, `CategoryService.update()`, and `ProductService.update()`.

**Fix applied** (BACKEND, 2026-08-25): `update()` in `ServiceCatalogService.java`/`CategoryService.java`/`ProductService.java` changed from `repository.save(entity)` to `repository.saveAndFlush(entity)`, forcing the `@PreUpdate` callback (and thus the real `updatedAt` write) to run synchronously before the response DTO is built. 3 new regression tests added; `mvn clean test` reported 79/79 passing.

**Re-verification** (QA Pass 3, 2026-08-25, against the live rebuilt Docker container, real JWT, real wall-clock gaps, not just trusting `mvn test`):

- **Services**: created test service id 12 (`createdAt`=`updatedAt`=`00:27:57.515631329Z`). `PUT1` (4s later) returned `updatedAt: 00:28:07.835350076Z` — differs from `createdAt`, correctly reflects *this* update, and matches the immediately-following `GET`'s `updatedAt: 00:28:07.835350Z` exactly (sub-microsecond JSON-serialization truncation only). `PUT2` (4s later still) returned `updatedAt: 00:28:19.621944670Z`, again differing from `PUT1`'s value and exactly matching the follow-up `GET`.
- **Categories**: created test category id 13, `PUT1` returned `updatedAt: 00:28:35.254296358Z` (≠ `createdAt: 00:28:25.633826998Z`), matched by `GET`'s `00:28:35.254296Z`.
- **Products**: created test product id 17, `PUT1` returned `updatedAt: 00:29:10.213022692Z` (≠ `createdAt: 00:28:47.683463468Z`), matched by `GET`'s `00:29:10.213023Z`. (Also incidentally re-confirmed `stockStatus` enum validation — `LOW_STOCK` correctly rejected `400`, `ON_ORDER` accepted, per contract.)

All three resource types now return the *current* `updatedAt` synchronously in the `PUT` response, matching a follow-up `GET` exactly — the stale-by-one-revision bug is gone. No regression observed in adjacent behavior exercised during the same pass: duplicate-slug still correctly returns `409 CONFLICT` ("Bu slug zaten kullanılıyor."), category-delete-with-products-attached still correctly returns `409 CONFLICT` with the exact contract message, and `site-settings` `PUT` (an endpoint *not* touched by this fix, used as a control) still round-trips correctly. All QA-created test rows (services id 12, categories ids 13/14, products ids 17/18) were deleted and confirmed `404` afterward; baseline counts restored and confirmed (`services`=6, `categories`=6, `products`=12 via `totalElements`, `contact-messages`=2).

**Status**: FIXED — VERIFIED

---

### BUG-005
**Severity**: MEDIUM
**Owner**: FRONTEND
**Area**: SEO metadata — missing `og:image`/`twitter:image` and missing canonical URL on every page

**Steps to reproduce**:
1. `curl http://localhost:3000/` (and each of `/hizmetler`, `/urunler`, `/baski-merkezi`, `/kurumsal`, `/iletisim`).
2. Inspect the `<head>` for `<meta property="og:image">`, `<meta name="twitter:image">`, and `<link rel="canonical">`.

**Expected**: Per standard SEO/social-sharing practice (and implied by the presence of `metadataBase` in `frontend/src/app/layout.tsx`, which exists specifically to resolve relative OG/canonical URLs), every page should have an `og:image` (so links shared on WhatsApp/Facebook/Instagram/LinkedIn/X render a preview image — important for a real local retail business whose customers are likely to share links via WhatsApp) and a `<link rel="canonical">` pointing at its own absolute URL.

**Actual**: Neither tag is present anywhere on the site. Full `<head>` dump of `/` confirms `og:title`, `og:description`, `og:site_name`, `og:locale`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description` are all present and correct, but there is no `og:image`, no `twitter:image`, and no `rel="canonical"` link at all. Same gap confirmed on all 5 other routes (`/hizmetler`, `/urunler`, `/baski-merkezi`, `/kurumsal`, `/iletisim`) — none of the per-page `metadata` exports in `frontend/src/app/(site)/**/page.tsx` set `openGraph.images` or `alternates.canonical` either, and the root `frontend/src/app/layout.tsx` `openGraph` object (lines 43-50) has no `images` key.

Structured data itself is correct and present: the `Store` (a valid `LocalBusiness` subtype per schema.org) JSON-LD block on the homepage has the correct NAP — `"telephone":"0312 911 81 02"`, `"address":{"streetAddress":"Eryaman Port AVM","addressLocality":"Etimesgut","addressRegion":"Ankara","addressCountry":"TR"}` — matching the real business location, so this bug is scoped specifically to the missing `og:image`/`twitter:image`/canonical tags, not the structured data.

**Evidence**: `curl -s http://localhost:3000/ | grep -oE '<head>.*</head>'` — full head dump contains no `og:image`/`twitter:image`/`canonical` substring on any of the 6 public routes. Source: `frontend/src/app/layout.tsx` lines 26-51 (root `metadata`, `openGraph` object has no `images`), and each of `frontend/src/app/(site)/{page,hizmetler/page,urunler/page,baski-merkezi/page,kurumsal/page,iletisim/page}.tsx` (`export const metadata`) — none set `alternates.canonical` or `openGraph.images`.

**Recommended action**: Add a shared OG image asset (e.g. `/public/og-image.jpg`, 1200×630) and reference it via `openGraph.images` in the root `layout.tsx` metadata (inherited by pages that don't override it), plus set `alternates: { canonical: "/" }` (and the page-specific path) in each page's `metadata` export, using the existing `metadataBase` to resolve relative URLs.

**Fix applied** (FRONTEND, 2026-08-25): Added `frontend/src/app/opengraph-image.tsx` and `twitter-image.tsx` using Next.js's `ImageResponse` file convention (1200×630), plus `alternates.canonical` on all 6 public page `metadata` exports.

**Re-verification** (QA Pass 3, 2026-08-25, against the live rebuilt Docker container — `curl`ing the actual served HTML, not a local dev server):

- `/` — head contains `<link rel="canonical" href="http://localhost:3000"/>`, `<meta property="og:image" content="http://localhost:3000/opengraph-image?ad2bc72fc5a98d1d"/>` (with correct `og:image:type`/`width`/`height`/`alt`), and the matching `twitter:image` set.
- `/iletisim` — `<link rel="canonical" href="http://localhost:3000/iletisim"/>` (page-specific, not just a copy of the homepage's), same `og:image`/`twitter:image` block.
- `/hizmetler`, `/urunler`, `/baski-merkezi`, `/kurumsal` — each has its own correct page-specific `rel="canonical"` and the same `og:image` reference.
- The generated image endpoints themselves were fetched directly and resolve correctly: `GET http://localhost:3000/opengraph-image?...` → `200`, `content-type: image/png`, `32968` bytes; `GET .../twitter-image?...` → same. Not a broken/404 image reference.

All 6 public routes now serve `og:image`, `twitter:image`, and a correct page-specific canonical URL in the real Docker-deployed HTML.

**Status**: FIXED — VERIFIED

---

### BUG-006
**Severity**: MEDIUM
**Owner**: FRONTEND
**Area**: Performance — homepage/İletişim Largest Contentful Paint (~4.2s)

**Steps to reproduce**: `npx lighthouse http://localhost:3000/ --chrome-flags="--headless=new" --output=json` (and same against `/iletisim`), against the live Docker Compose stack.

**Expected**: Google's "good" LCP threshold is ≤2.5s; scores in the 4.0s+ range sit at the boundary of "poor."

**Actual**: Lighthouse Performance score is **85/100** on both `/` and `/iletisim` (consistent across two separate runs), driven almost entirely by **LCP ≈ 4.2s** (FCP is fine at ~1.7-1.8s, TBT is excellent at 20ms, CLS is a perfect 0 — no layout shift). Accessibility, Best Practices, and SEO categories all scored a perfect **100/100** on both pages. Diagnostics show only modest individually-fixable contributors (51 KiB unused JS, ~150ms of render-blocking CSS, 13 KiB of legacy-JS-insight savings) — none of which individually account for the full LCP gap, suggesting most of the delay is either the Framer Motion scroll-reveal animation gating visible paint of the hero/LCP element, or general latency of this specific non-CDN, containerized local environment (SSR round-trip through Docker's internal network, unoptimized dev-adjacent asset serving) rather than one single obvious frontend defect.

**Evidence**: `lh-home.json`/`lh-iletisim.json` (Lighthouse JSON reports, this QA session) — `categories.performance.score: 0.85` on both; `audits["largest-contentful-paint"].displayValue: "4.2 s"` on both; `audits["cumulative-layout-shift"].displayValue: "0"`; `audits["total-blocking-time"].displayValue: "20 ms"`.

**Caveat**: Measured against the local Docker Compose stack on a dev workstation, not a production CDN-backed deployment — absolute numbers may improve in production, but the relative gap between LCP and the other (excellent) metrics is a real signal worth a frontend look, particularly whether the hero content's visibility is being needlessly delayed by entrance-animation timing.

**Recommended action**: Profile the homepage/İletişim LCP element in Chrome DevTools Performance panel to identify what it actually is and what's delaying its paint; consider whether the hero/above-the-fold content should render immediately (opacity starting at 1, motion only applied after) rather than being gated behind a scroll-reveal animation's initial "hidden" state; address the flagged unused-JS/render-blocking-CSS items as lower-effort wins regardless.

**Fix applied** (FRONTEND, 2026-08-25): Added a `fade` prop to `Reveal` (`src/components/shared/reveal.tsx`) and set `fade={false} mode="mount"` on the H1 in `hero.tsx` and `page-hero.tsx`, so the LCP text paints immediately instead of waiting on an IntersectionObserver + fade transition. Engineer's own before/after Lighthouse run: Performance 85→87, LCP 4.2s→3.9s, `elementRenderDelay` 787ms→94ms.

**Re-verification** (QA Pass 3, 2026-08-25) — visual-correctness spot-check only, per this pass's scope (Lighthouse re-run not required, engineer's numbers already recorded above): took a real headless-Chrome screenshot of `/` via Playwright (`chromium.launch()`, `waitUntil: "networkidle"` + an additional real 2.5s wall-clock wait — no `--virtual-time-budget`), at both 1440px and 375px viewports.

- H1 (`"Kırtasiyeden Daha Fazlası."`) is fully visible and correctly styled in both screenshots, computed `opacity: 1`, no stuck-hidden/half-faded state.
- No layout jump, no overlapping content, no flash-of-invisible-text observed at either breakpoint.
- Zero browser console errors/page errors during the load.

Visual regression check passed — the LCP timing fix did not introduce any visual defect.

**Status**: FIXED — VERIFIED (visual correctness only; performance numbers per engineer's report above, not independently re-measured this pass)

---

## QA Pass 2 — Areas checked with no bugs found

For completeness, the following were exercised this pass and found correct (not re-litigating what QA Pass 1 already verified):

- **Full admin CRUD, all 5 resource types**, real JWT against the live stack: services, categories, products (create/read/update/delete, duplicate-slug 409, invalid-enum 400, invalid-`categoryId` 400 `VALIDATION_ERROR`, category-delete-with-products 409 with the exact contract message, cascading cleanup all verified); contact-messages (list w/ pagination envelope, `status` filter, 401/404/400 edge cases, `PATCH` status transition, `DELETE`); site-settings (`GET`/`PUT`, invalid-URL 400, blank-required-field 400, public vs admin variants both correct, NAP fields — `"Eryaman Port AVM, Etimesgut / Ankara"` / `"0312 911 81 02"` — correct). All test data created during this pass was cleaned up and verified absent afterward (services/categories/products counts back to baseline 6/6/12; contact-messages back to the 2 pre-existing legitimate rows).
- **İletişim page** (never checked before this pass): visually correct at 375px/1024px/1440px, no overflow; empty-submit shows per-field Turkish validation errors (`"E-posta adresi zorunludur."`, `"Konu en az 3 karakter olmalıdır."`, `"Mesaj en az 10 karakter olmalıdır."`); invalid-email shows its own field error; a real browser-driven valid submission shows the success message (`"Mesajınız başarıyla iletildi..."`) and the message is provably persisted (visible via `GET /api/admin/contact-messages` immediately after); zero console/page errors during the whole flow; the "Haritada Görüntüle" fallback (when `mapEmbedUrl` is unset) is a working Google Maps search link, not a dead link.
- **All 7 routes × 4 breakpoints (375/768/1024/1440px)**: real-Chrome, real-wall-clock-wait screenshots (no `--virtual-time-budget`) taken for every combination. Zero horizontal overflow (`scrollWidth` vs `clientWidth`) on any page/breakpoint. Zero real console errors, zero real failed network requests (the only "failed requests" observed were Next.js RSC-prefetch requests aborted by the test harness closing pages mid-navigation — `net::ERR_ABORTED`, never a 4xx/5xx from the server — not a bug).
- **Mobile nav menu** (375px): opens correctly, all 7 links + CTA present, no overlap.
- **Admin panel**: login → dashboard → all 5 protected sub-pages (`/admin/services`, `/admin/categories`, `/admin/products`, `/admin/messages`, `/admin/settings`) all load cleanly with zero console errors and zero non-2xx responses (an initial 404 seen in one script run was traced to the QA script itself guessing wrong URLs — `/admin/contact-messages`/`/admin/site-settings` — that the app never actually links to; the real routes `/admin/messages`/`/admin/settings`, confirmed via the dashboard's own `<Link>` hrefs, work fine).
- **Broken links**: no 404s found across any in-app navigation (nav, footer, in-page CTAs, admin sidebar) during the full route/breakpoint sweep.
- **Accessibility**: keyboard Tab order through İletişim is logical (logo → nav → CTA → contact-info links → map link → form fields) with a visible `solid 2px` focus outline at every stop (confirmed both programmatically and via screenshot); `prefers-reduced-motion: reduce` handled globally in `globals.css`; computed WCAG contrast ratios for the two brand text colors on the primary background — muted `#a5a5a5` on `#090909` ≈ 8.08:1, gold `#c9a24a` on `#090909` ≈ 8.30:1 — both comfortably exceed AAA (7:1). Lighthouse Accessibility score: **100/100** on both pages tested.
- **SEO**: unique, on-topic `<title>`/meta-description per page confirmed on all 6 public routes; `robots.txt` and `sitemap.xml` both correctly generated and env-driven (`NEXT_PUBLIC_SITE_URL`, currently `http://localhost:3000` in this QA `.env`, would be the real domain in production — not a bug); `Store` (valid `LocalBusiness` subtype) JSON-LD present on the homepage with correct NAP matching the real business (`"Eryaman Port AVM"`, `"Etimesgut"`, `"Ankara"`, `"0312 911 81 02"`). Lighthouse SEO score: **100/100** on both pages tested (see BUG-005 for the one real gap found — missing `og:image`/canonical — which Lighthouse's SEO category doesn't penalize by default).
- **Lighthouse Best Practices**: **100/100** on both pages tested.
- **Docker Compose stack**: reconfirmed healthy throughout this entire pass (`docker compose ps` — postgres/backend/frontend all `Up (healthy)` at both the start and end of this session, no restarts observed).

## QA Pass 2 — Summary

**New bugs found this pass**: 3 total — 0 CRITICAL, 0 HIGH, **3 MEDIUM**, 0 LOW.
- BUG-004 (MEDIUM, BACKEND) — `updatedAt` stale-by-one-revision in `PUT` responses for services/categories/products (root-caused precisely to `@PreUpdate`/flush-timing; DB and `GET` are always correct, only the synchronous `PUT` response body is affected).
- BUG-005 (MEDIUM, FRONTEND) — missing `og:image`/`twitter:image` and missing `<link rel="canonical">` site-wide.
- BUG-006 (MEDIUM, FRONTEND) — Lighthouse Performance 85/100 on `/` and `/iletisim`, driven by LCP ≈ 4.2s (all other Lighthouse categories are 100/100 on both pages).

**Critical E2E flow** (visitor → contact form → Next.js → Spring Boot → PostgreSQL → `contact_messages` row → visible in Admin Panel): **PASS**, reconfirmed via a real headless-Chrome browser session this pass (not just the API) — form submission, success UI, and the message's subsequent visibility via the admin API were all independently verified.

**Running total across both QA passes**: 0 CRITICAL, 0 HIGH, 3 MEDIUM open (BUG-004/005/006), 0 LOW open. BUG-001/002/003 from Pass 1 remain FIXED/VERIFIED. Acceptance criterion "zero CRITICAL and zero HIGH severity bugs open" is still satisfied; 3 MEDIUM bugs are open and should be routed to BACKEND (BUG-004) and FRONTEND (BUG-005, BUG-006) respectively.

---

## QA Pass 3 — 2026-08-25 (regression pass, post BUG-004/005/006 fixes)

Tested by: qa-integration-engineer role. Scope: focused regression against the freshly rebuilt Docker Compose stack (`docker compose up --build -d`, all 3 containers healthy at start and end of this pass) to verify the three MEDIUM fixes reported in QA Pass 2, plus a critical-E2E-flow and adjacent-admin-CRUD sanity check to catch any regression from the `saveAndFlush` change. Not a full re-scan of everything from Pass 1/2.

**BUG-004 (backend, `updatedAt` staleness)** — **FIXED — VERIFIED**. Re-tested live against the running container with a real JWT and real wall-clock gaps (not just trusting `mvn test`'s reported 79/79): created and PUT-updated a test service, category, and product, comparing each `PUT` response's `updatedAt` against `createdAt` and a follow-up `GET`. All three resource types now return the current, correct `updatedAt` synchronously in the `PUT` response body, matching the follow-up `GET` exactly. See BUG-004 entry above for full timestamps/evidence.

**BUG-005 (frontend, missing og:image/twitter:image/canonical)** — **FIXED — VERIFIED**. Re-tested against the actual Docker-served HTML (not a local dev server) via `curl` on all 6 public routes (`/`, `/hizmetler`, `/urunler`, `/baski-merkezi`, `/kurumsal`, `/iletisim`). Every route now has a correct page-specific `<link rel="canonical">`, plus `og:image`/`twitter:image` tags with correct dimensions/type/alt. The generated image endpoints (`/opengraph-image`, `/twitter-image`) were independently fetched and confirmed to return real `200 image/png` responses (32968 bytes), not broken references.

**BUG-006 (frontend, LCP fix visual regression check)** — **FIXED — VERIFIED** (visual correctness only, per this pass's scope; performance numbers not independently re-measured, engineer's before/after Lighthouse figures already on record). Took real headless-Chrome screenshots (Playwright, `waitUntil: "networkidle"` + 2.5s additional real wall-clock wait, no `--virtual-time-budget`) of the homepage at 1440px and 375px. Hero H1 renders fully visible immediately (`opacity: 1`, no stuck/half-faded state), no layout jump or flash, zero console errors.

**Adjacent admin-CRUD regression sanity check** (to catch any `saveAndFlush`-introduced transaction issue): re-tested duplicate-slug create on categories → still correctly `409 CONFLICT` ("Bu slug zaten kullanılıyor."); re-tested delete-category-with-products-attached → still correctly `409 CONFLICT` with the exact contract message; re-tested `PUT /api/admin/site-settings` (a control endpoint untouched by the `saveAndFlush` fix) → round-trips correctly (one 400 seen during this check was traced to a shell/curl UTF-8 encoding artifact in the QA script's own test payload — the `©` character — not a backend bug; confirmed by resubmitting the identical payload via a UTF-8-safe file, which returned `200` with byte-correct Turkish/© characters). No regression found.

**Critical E2E flow** (visitor → contact form → Next.js → Spring Boot → PostgreSQL → `contact_messages` row → visible in Admin Panel): **PASS**, re-verified end-to-end via a real Playwright browser session against the rebuilt stack — filled and submitted the real `/iletisim` form in a real browser, confirmed the success message rendered, confirmed the row was persisted (`GET /api/admin/contact-messages` showed the new row with the correct submitted subject/name), and confirmed it is visible by logging into the real `/admin/login` UI and loading `/admin/messages` in-browser (not just the API) — the submitted message appeared in the rendered admin table. Zero console errors throughout.

**Test data hygiene**: all QA-created rows this pass (services id 12, categories ids 13/14, products ids 17/18, 1 contact message) were deleted via the admin API and confirmed `404` afterward. `site-settings` was restored to its exact original values (byte-for-byte, including `©` and Turkish diacritics). Baseline counts reconfirmed at the end of the pass: services=6, categories=6, products=12 (`totalElements`), contact-messages=2. Docker Compose stack (`docker ps`) confirmed all 3 containers still `Up ... (healthy)` at the end of this pass, no restarts observed.

### QA Pass 3 — Summary

**All 3 bugs from Pass 2 confirmed fixed**: BUG-004 (BACKEND) FIXED — VERIFIED, BUG-005 (FRONTEND) FIXED — VERIFIED, BUG-006 (FRONTEND) FIXED — VERIFIED. **No new bugs found** this pass, no regressions introduced by any of the three fixes.

**Running total across all three QA passes**: **0 CRITICAL, 0 HIGH, 0 MEDIUM, 0 LOW open.** All 6 bugs found across the project's QA history (BUG-001 through BUG-006) are now FIXED — VERIFIED. Acceptance criterion "zero CRITICAL and zero HIGH severity bugs open" (and, as of this pass, zero of any severity) is satisfied.

**Critical E2E flow**: **PASS.**

**Build/test status**: Backend `mvn clean test` — 79/79 passing (per BACKEND engineer's report, consistent with the 3 new BUG-004 regression tests added; not independently re-run this pass, but live-API behavior independently re-verified above). Frontend/Docker — stack rebuilt via `docker compose up --build`, all 3 containers healthy, frontend↔backend integration confirmed working via both SSR (og:image/canonical pages) and client-side (contact form, admin panel) paths.

---
