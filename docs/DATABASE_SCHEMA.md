# DATABASE_SCHEMA — Port Ofis Kırtasiye

PostgreSQL. Schema is owned entirely by Flyway migrations in `backend/src/main/resources/db/migration/`. Hibernate `ddl-auto` must be `validate` (or `none`) — never `update`/`create`. Suggested migration split:

- `V1__create_initial_schema.sql` — all tables/constraints/indexes below.
- `V2__insert_initial_data.sql` — seed data (§7).
- Further `V3__…` etc. for any later change; never edit an already-applied migration.

All timestamp columns are `TIMESTAMPTZ`, defaulted to `now()` at the database level. All primary keys are `BIGSERIAL` (`BIGINT` auto-increment).

## 1. `services`

Public-facing service catalog (Hizmetler page + homepage "Selected Services").

| Column             | Type           | Constraints                                                        |
|---------------------|----------------|----------------------------------------------------------------------|
| `id`                | BIGSERIAL      | PRIMARY KEY                                                          |
| `slug`              | VARCHAR(120)   | NOT NULL, UNIQUE                                                     |
| `name`              | VARCHAR(150)   | NOT NULL                                                             |
| `short_description` | VARCHAR(200)   | NOT NULL                                                             |
| `description`       | TEXT           | NOT NULL                                                             |
| `icon_key`          | VARCHAR(50)    | NOT NULL — semantic key the frontend maps to an icon component (e.g. `printer`, `pen-nib`, `box`, `gift`, `stamp`, `building`); not a file upload |
| `display_order`     | INTEGER        | NOT NULL, DEFAULT 0                                                  |
| `is_active`         | BOOLEAN        | NOT NULL, DEFAULT TRUE                                               |
| `created_at`        | TIMESTAMPTZ    | NOT NULL, DEFAULT now()                                              |
| `updated_at`        | TIMESTAMPTZ    | NOT NULL, DEFAULT now()                                              |

Indexes:
- `services_slug_key` — UNIQUE (`slug`) (implied by the column constraint)
- `idx_services_active_order` — (`is_active`, `display_order`) — speeds up the public "active services, in order" query.

## 2. `categories`

Product categories for the Ürünler page.

| Column          | Type          | Constraints                          |
|------------------|---------------|----------------------------------------|
| `id`             | BIGSERIAL     | PRIMARY KEY                            |
| `slug`           | VARCHAR(120)  | NOT NULL, UNIQUE                       |
| `name`           | VARCHAR(150)  | NOT NULL                               |
| `description`    | TEXT          | NULL                                    |
| `image_url`      | VARCHAR(500)  | NULL                                    |
| `display_order`  | INTEGER       | NOT NULL, DEFAULT 0                    |
| `is_active`      | BOOLEAN       | NOT NULL, DEFAULT TRUE                 |
| `created_at`     | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                |
| `updated_at`     | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                |

Indexes:
- `categories_slug_key` — UNIQUE (`slug`)
- `idx_categories_active_order` — (`is_active`, `display_order`)

## 3. `products`

| Column          | Type            | Constraints                                                              |
|------------------|-----------------|-----------------------------------------------------------------------------|
| `id`             | BIGSERIAL       | PRIMARY KEY                                                                  |
| `category_id`    | BIGINT          | NOT NULL, REFERENCES `categories(id)` ON DELETE RESTRICT                    |
| `slug`           | VARCHAR(150)    | NOT NULL, UNIQUE                                                             |
| `name`           | VARCHAR(200)    | NOT NULL                                                                     |
| `description`    | TEXT            | NULL                                                                          |
| `image_url`      | VARCHAR(500)    | NULL                                                                          |
| `price`          | NUMERIC(10,2)   | NULL — **not used for checkout in this phase**; reserved so a future e-commerce phase doesn't need a schema change. May be shown as an indicative price if the admin fills it in. |
| `stock_status`   | VARCHAR(20)     | NOT NULL, DEFAULT `'IN_STOCK'`, CHECK (`stock_status` IN (`'IN_STOCK'`,`'OUT_OF_STOCK'`,`'ON_ORDER'`)) |
| `display_order`  | INTEGER         | NOT NULL, DEFAULT 0                                                          |
| `is_active`      | BOOLEAN         | NOT NULL, DEFAULT TRUE                                                       |
| `created_at`     | TIMESTAMPTZ     | NOT NULL, DEFAULT now()                                                      |
| `updated_at`     | TIMESTAMPTZ     | NOT NULL, DEFAULT now()                                                      |

Relationships: `products.category_id → categories.id`, many-to-one. `ON DELETE RESTRICT` is deliberate: the admin cannot delete a category that still has products (API returns `409 CONFLICT`, see `docs/API_CONTRACT.md`) — this avoids orphaned/inconsistent product data without needing cascade logic.

Indexes:
- `products_slug_key` — UNIQUE (`slug`)
- `idx_products_category` — (`category_id`)
- `idx_products_active_order` — (`is_active`, `display_order`)

## 4. `contact_messages`

Every submission of the İletişim contact form.

| Column       | Type          | Constraints                                                        |
|---------------|---------------|-----------------------------------------------------------------------|
| `id`          | BIGSERIAL     | PRIMARY KEY                                                            |
| `name`        | VARCHAR(100)  | NOT NULL                                                               |
| `phone`       | VARCHAR(30)   | NOT NULL                                                               |
| `email`       | VARCHAR(150)  | NOT NULL                                                               |
| `subject`     | VARCHAR(150)  | NOT NULL                                                               |
| `message`     | TEXT          | NOT NULL                                                               |
| `status`      | VARCHAR(10)   | NOT NULL, DEFAULT `'NEW'`, CHECK (`status` IN (`'NEW'`,`'READ'`))     |
| `created_at`  | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                                                |

Indexes:
- `idx_contact_messages_status_created` — (`status`, `created_at` DESC) — speeds up the admin inbox (unread-first, newest-first).

No `updated_at`: the only mutation this table ever undergoes is the `status` flip to `READ`, which doesn't need its own audit column for a site this size.

## 5. `site_settings`

Simple key/value store for editable site-wide content (address, phone, socials, etc.), so these never need a code change.

| Column        | Type          | Constraints                    |
|----------------|---------------|-----------------------------------|
| `id`           | BIGSERIAL     | PRIMARY KEY                       |
| `key`          | VARCHAR(80)   | NOT NULL, UNIQUE                  |
| `value`        | TEXT          | NULL                               |
| `updated_at`   | TIMESTAMPTZ   | NOT NULL, DEFAULT now()           |

Indexes:
- `site_settings_key_key` — UNIQUE (`key`)

The API layer flattens these rows into a single JSON object (see `docs/API_CONTRACT.md` §8) — the key/value shape is a persistence detail, not something the frontend deals with directly.

Known keys (all rows must exist after seeding; admin can edit values, not add/remove keys, since the API is a fixed-shape object — see contract):

`site_name`, `phone`, `address`, `website_url`, `whatsapp_number`, `instagram_url`, `facebook_url`, `working_hours`, `map_embed_url`, `footer_note`.

## 6. `admin_users`

Not in the original minimum list, but required to implement the "single admin auth boundary" from `docs/ARCHITECTURE.md` §6 without hardcoding any secret.

| Column           | Type          | Constraints                    |
|-------------------|---------------|-----------------------------------|
| `id`              | BIGSERIAL     | PRIMARY KEY                       |
| `username`        | VARCHAR(60)   | NOT NULL, UNIQUE                  |
| `password_hash`   | VARCHAR(255)  | NOT NULL — BCrypt hash            |
| `created_at`      | TIMESTAMPTZ   | NOT NULL, DEFAULT now()           |

No seed row for this table ships in `V2__insert_initial_data.sql` (that would mean committing a real or placeholder credential to source control). Instead, the backend creates the first row at application startup **only if the table is empty**, from `ADMIN_DEFAULT_USERNAME` / `ADMIN_DEFAULT_PASSWORD` environment variables (hashed before insert). See `docs/ARCHITECTURE.md` §6.

## 7. Seed data (`V2__insert_initial_data.sql`)

### 7.1 `services` (required — exact 6, per business requirements)

| slug | name | icon_key | display_order |
|---|---|---|---|
| `dijital-baski` | Dijital Baskı | `printer` | 1 |
| `kirtasiye` | Kırtasiye | `pen-nib` | 2 |
| `sarf-malzemeleri` | Sarf Malzemeleri | `box` | 3 |
| `kisiye-ozel-baski` | Kişiye Özel Baskı | `sparkles` | 4 |
| `oyuncak-hediyelik` | Oyuncak & Hediyelik | `gift` | 5 |
| `kase-kurumsal-cozumler` | Kaşe & Kurumsal Çözümler | `building` | 6 |

`short_description` and `description` must be written in Turkish, consistent with each service's business meaning (e.g. Dijital Baskı → renkli/siyah beyaz çıktı, fotokopi, tarama, kupa/fotoğraf baskı; Kaşe & Kurumsal Çözümler → kaşe, kurumsal baskı ve kurumsal kırtasiye tedariği). Exact wording is the backend engineer's call; must not contradict the business facts in `docs/PROJECT_PLAN.md` §2.

### 7.2 `categories` (required — minimum 6, to populate the Ürünler page)

| slug | name |
|---|---|
| `kirtasiye-urunleri` | Kırtasiye Ürünleri |
| `sarf-malzemeleri` | Sarf Malzemeleri |
| `toner-kartus` | Toner & Kartuş |
| `oyuncak` | Oyuncak |
| `hediyelik-urunler` | Hediyelik Ürünler |
| `kisiye-ozel-baski-urunleri` | Kişiye Özel Baskı Ürünleri |

### 7.3 `products` (required — at least 2 per category so the Ürünler page and admin panel are never empty out of the box)

Illustrative only; exact names/descriptions are the backend engineer's call as long as they fit the category and business facts, e.g.:

- Under `kisiye-ozel-baski-urunleri`: "Kişiye Özel Kupa Baskı", "Kişiye Özel Kartvizit Baskısı".
- Under `toner-kartus`: a couple of common toner/kartuş model placeholders.
- Under `oyuncak` / `hediyelik-urunler`: generic seed items (e.g. "Karışık Oyuncak Seti", "Hediyelik Kalem Seti").

Leave `price` NULL for seed rows unless a real price is known; `stock_status = 'IN_STOCK'`.

### 7.4 `site_settings` (required — all 10 keys must exist)

| key | seed value |
|---|---|
| `site_name` | `Port Ofis Kırtasiye` |
| `phone` | `0312 911 81 02` |
| `address` | `Eryaman Port AVM, Etimesgut / Ankara` |
| `website_url` | `https://portofiskirtasiye.com.tr` |
| `whatsapp_number` | `` (empty — not provided by business, editable later in admin) |
| `instagram_url` | `` (empty) |
| `facebook_url` | `` (empty) |
| `working_hours` | `` (empty — not provided; admin can fill in) |
| `map_embed_url` | `` (empty) |
| `footer_note` | `© 2026 Port Ofis Kırtasiye. Tüm hakları saklıdır.` |

**Assumption flagged for business-owner sanity check**: `whatsapp_number`, `instagram_url`, `facebook_url`, `working_hours`, `map_embed_url` have no source value in the business facts given to this agent. They are seeded empty (not omitted, since the API always returns the fixed key set) and are expected to be filled in via the admin panel once real values are known.
