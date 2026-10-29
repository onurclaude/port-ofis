# CLAUDE.md

Port Ofis Kırtasiye (portofiskirtasiye.com.tr): Next.js frontend (`frontend/`), Spring Boot backend (`backend/`), PostgreSQL, all via Docker Compose. Detailed docs live in `docs/` (ARCHITECTURE, API_CONTRACT, DATABASE_SCHEMA, ...).

## Production server — do not undo

The live site runs on a VPS behind a host-level nginx that terminates HTTPS and proxies `/api/` → `127.0.0.1:8080` and `/` → `127.0.0.1:3000`. Keep these when editing:

- `docker-compose.yml`: published ports must stay bound to `127.0.0.1` (`"127.0.0.1:8080:8080"`, `"127.0.0.1:3000:3000"`, postgres `"127.0.0.1:5432:5432"`). The server has no firewall in front of Docker; a bare `"8080:8080"` exposes the API/DB on the public IP.
- `frontend/package.json`: Next.js must stay at **16.3.8 or newer** (security fix). Do not downgrade when regenerating the lockfile.
- `frontend/next.config.ts`: the image proxy (`images.remotePatterns` etc.) is deliberately restricted; don't widen it to `**`.
- Flyway migrations are append-only: never edit an applied `V*.sql`, add a new version instead (`V7` fills product/category images that live in `frontend/public/gorseller/`).
- Contact form (`POST /api/contact`, used by the İletişim page and the "Kurumsal Teklif Al" buttons via `?subject=`): the message is saved to the DB and then, after commit and asynchronously, `ContactMailNotifier` emails `CONTACT_NOTIFY_TO` (production: portofiskirtasiye@gmail.com) with `Reply-To` set to the visitor. SMTP comes from `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` / `CONTACT_NOTIFY_FROM` in the root `.env` (see `.env.example`). If unset, the mail is skipped and nothing else changes. A mail failure must never fail the request.
- The host nginx rate-limits `POST /api/contact` (3/min per IP); there is no in-app limit.
- `.env` holds the real secrets and is gitignored; never commit it.

## Tests

`cd backend && mvn test` (integration tests use Testcontainers/PostgreSQL). With Docker Engine 29+ the bundled Testcontainers 1.20.x needs `api.version=1.44` in `~/.docker-java.properties`. `PublicProductApiTest.defaultPageSizeIsTwelve` is stale (expects 12 products; migrations V3/V5/V6 seed 15).
