# API_CONTRACT — Port Ofis Kırtasiye

**This document is binding.** Backend must implement exactly this; frontend must call exactly this. Any deviation must go back through the analyst-architect, not be improvised by either side. Field names are `camelCase` in JSON (mapped from `snake_case` DB columns by the backend).

Base path: all endpoints are under `/api`. Full URL = `<base URL> + path`, where `<base URL>` depends on where the calling code runs (see `docs/ARCHITECTURE.md` §4 for the full rationale):
- Client-side (browser) fetch code: `NEXT_PUBLIC_API_BASE_URL`.
- Server-side (Next.js Server Components, Route Handlers, `generateMetadata`) fetch code: `API_BASE_URL_INTERNAL ?? NEXT_PUBLIC_API_BASE_URL` (falls back to the public var when the server-only one is unset, which is always true outside Docker Compose).

## 1. Conventions

- **Content-Type**: `application/json` for all requests/responses with a body.
- **Timestamps**: ISO-8601 UTC instant, e.g. `"2026-08-24T10:15:30.123Z"`.
- **IDs**: JSON numbers (backend `Long`), not strings.
- **Single resource** GET/POST/PUT responses: the DTO object directly, no envelope.
- **Unpaginated list** endpoints: a bare JSON array `[ {...}, {...} ]`.
- **Paginated list** endpoints: the pagination envelope (§2).
- **DELETE**: `204 No Content`, empty body.
- **Auth header** (admin only): `Authorization: Bearer <jwt>`.
- All public GET list endpoints (`services`, `categories`, `products`) only ever return rows where `isActive = true`; admin list endpoints return all rows regardless of `isActive`, with `isActive` visible in the DTO so the admin UI can show/toggle it.
- Ordering: unless stated otherwise, lists are ordered by `displayOrder ASC`, then `name ASC` as a tiebreaker.

## 2. Pagination envelope

Used by `GET /api/products`, `GET /api/admin/products`, `GET /api/admin/contact-messages`.

```json
{
  "content": [ /* array of DTOs */ ],
  "page": 0,
  "size": 12,
  "totalElements": 42,
  "totalPages": 4
}
```

Query params: `page` (0-based, default `0`), `size` (default `12` for `/api/products`, `20` for admin lists; max `100` — a request for a larger size is clamped to 100, not rejected).

## 3. Standard error model

Every non-2xx response body has this exact shape:

```json
{
  "timestamp": "2026-08-24T10:15:30.123Z",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Doğrulama hatası oluştu.",
  "fieldErrors": [
    { "field": "email", "message": "Geçerli bir e-posta adresi giriniz." }
  ]
}
```

`fieldErrors` is always present; it's `[]` when not a field-validation error.

### Error codes → status

| `code`              | `status` | When |
|---------------------|----------|------|
| `VALIDATION_ERROR`  | 400 | Bean Validation failed on a request DTO. `fieldErrors` populated, one entry per invalid field. |
| `BAD_REQUEST`       | 400 | Malformed JSON, invalid query param (e.g. non-numeric `page`), unsupported enum value. |
| `UNAUTHORIZED`      | 401 | Missing/invalid/expired JWT on an `/api/admin/**` route; or bad credentials on login. |
| `FORBIDDEN`         | 403 | Reserved for future role checks. Not triggered by anything in this phase (single admin role). |
| `NOT_FOUND`         | 404 | Path-referenced resource (by id or slug) does not exist. |
| `CONFLICT`          | 409 | Unique constraint violation (duplicate `slug`, duplicate `key`), or FK protection (deleting a category that still has products). |
| `INTERNAL_ERROR`    | 500 | Unhandled exception. `message` must never leak stack traces or SQL. |

All error responses across the whole API use this single `@ControllerAdvice`-produced shape — no endpoint-specific error formats.

---

## 4. Services — `/api/services` (public)

### 4.1 `GET /api/services`
Returns all active services, ordered.

**Response `200`**
```json
[
  {
    "id": 1,
    "slug": "dijital-baski",
    "name": "Dijital Baskı",
    "shortDescription": "Renkli ve siyah-beyaz baskı, fotokopi, tarama ve daha fazlası.",
    "description": "Uzun açıklama metni...",
    "iconKey": "printer",
    "displayOrder": 1
  }
]
```
(Public DTO omits `isActive`, `createdAt`, `updatedAt` — irrelevant to visitors.)

### 4.2 `GET /api/services/{slug}`
**Response `200`**: same shape as one array element above.
**Response `404`**: `NOT_FOUND` if no active service has that slug.

---

## 5. Categories — `/api/categories` (public)

### 5.1 `GET /api/categories`
**Response `200`**
```json
[
  {
    "id": 1,
    "slug": "kirtasiye-urunleri",
    "name": "Kırtasiye Ürünleri",
    "description": "Kategori açıklaması...",
    "imageUrl": "https://.../kategori.jpg",
    "displayOrder": 1
  }
]
```

### 5.2 `GET /api/categories/{slug}`
**Response `200`**: same shape. **Response `404`**: `NOT_FOUND`.

---

## 6. Products — `/api/products` (public)

### 6.1 `GET /api/products?categorySlug={slug}&page=0&size=12`
`categorySlug` optional. Returns the pagination envelope (§2), items ordered as in §1.

**Response `200`**
```json
{
  "content": [
    {
      "id": 10,
      "slug": "kisiye-ozel-kupa-baski",
      "name": "Kişiye Özel Kupa Baskı",
      "description": "Ürün açıklaması...",
      "imageUrl": "https://.../kupa.jpg",
      "price": null,
      "stockStatus": "IN_STOCK",
      "category": { "id": 6, "slug": "kisiye-ozel-baski-urunleri", "name": "Kişiye Özel Baskı Ürünleri" }
    }
  ],
  "page": 0,
  "size": 12,
  "totalElements": 14,
  "totalPages": 2
}
```
`price` is `null` unless the admin has set one; frontend must not assume it's always present. `stockStatus` is one of `IN_STOCK` / `OUT_OF_STOCK` / `ON_ORDER`.

**Response `400`**: `BAD_REQUEST` if `categorySlug` is a non-existent slug — **no**, actually: an unknown `categorySlug` returns `200` with an **empty** `content` array (not an error — a filter that matches nothing is not a client error). `BAD_REQUEST` is reserved for malformed `page`/`size` (non-numeric, negative).

### 6.2 `GET /api/products/{slug}`
**Response `200`**: same item shape as above. **Response `404`**: `NOT_FOUND`.

---

## 7. Contact — `/api/contact` (public)

### 7.1 `POST /api/contact`

**Request**
```json
{
  "name": "Ahmet Yılmaz",
  "phone": "0555 123 45 67",
  "email": "ahmet@example.com",
  "subject": "Kurumsal teklif talebi",
  "message": "Merhaba, ofisimiz için kurumsal kırtasiye tedariği hakkında bilgi almak istiyorum."
}
```

**Validation**
| Field | Rules |
|---|---|
| `name` | required, 2–100 chars |
| `phone` | required, 7–20 chars, pattern `^[0-9+() -]+$` |
| `email` | required, valid email format, max 150 chars |
| `subject` | required, 3–150 chars |
| `message` | required, 10–2000 chars |

Any failure → `400 VALIDATION_ERROR` with one `fieldErrors` entry per invalid field.

**Response `201`**
```json
{
  "id": 55,
  "name": "Ahmet Yılmaz",
  "phone": "0555 123 45 67",
  "email": "ahmet@example.com",
  "subject": "Kurumsal teklif talebi",
  "message": "Merhaba, ofisimiz için...",
  "status": "NEW",
  "createdAt": "2026-08-24T10:15:30.123Z"
}
```
Frontend does not need to display this body — it shows its own static success message per `docs/FRONTEND_SPEC.md` — but the full created resource is returned for consistency with the rest of the API and for easier debugging/testing.

No rate limiting / CAPTCHA is specified for this phase (out of scope) — noted as a possible future hardening item, not built now.

---

## 8. Site settings — `/api/site-settings` (public)

### 8.1 `GET /api/site-settings`
Flattens the `site_settings` key/value rows (§`docs/DATABASE_SCHEMA.md` §5) into one fixed-shape object. All 10 keys are always present (empty string if unset, never `null`, never omitted).

**Response `200`**
```json
{
  "siteName": "Port Ofis Kırtasiye",
  "phone": "0312 911 81 02",
  "address": "Eryaman Port AVM, Etimesgut / Ankara",
  "websiteUrl": "https://portofiskirtasiye.com.tr",
  "whatsappNumber": "",
  "instagramUrl": "",
  "facebookUrl": "",
  "workingHours": "",
  "mapEmbedUrl": "",
  "footerNote": "© 2026 Port Ofis Kırtasiye. Tüm hakları saklıdır."
}
```

---

## 9. Admin authentication — `/api/admin/auth`

### 9.1 `POST /api/admin/auth/login`
No auth header required (this is how you get one).

**Request**
```json
{ "username": "admin", "password": "changeme" }
```
Validation: both required, non-blank.

**Response `200`**
```json
{
  "token": "<jwt>",
  "expiresAt": "2026-08-24T22:15:30.123Z",
  "username": "admin"
}
```

**Response `401`**: `UNAUTHORIZED`, message `"Kullanıcı adı veya şifre hatalı."` — identical response whether the username doesn't exist or the password is wrong (do not leak which one).

All routes below require header `Authorization: Bearer <token>` from this response. Missing/invalid/expired token on any of them → `401 UNAUTHORIZED`.

---

## 10. Admin — Services `/api/admin/services`

Full entity DTO (includes `isActive`, `createdAt`, `updatedAt` on top of the public fields).

### 10.1 `GET /api/admin/services`
**Response `200`**: bare array (not paginated — small, fixed-ish list), all services regardless of `isActive`, ordered by `displayOrder`.
```json
[
  {
    "id": 1, "slug": "dijital-baski", "name": "Dijital Baskı",
    "shortDescription": "...", "description": "...", "iconKey": "printer",
    "displayOrder": 1, "isActive": true,
    "createdAt": "2026-08-24T09:00:00Z", "updatedAt": "2026-08-24T09:00:00Z"
  }
]
```

### 10.2 `POST /api/admin/services`
**Request**
```json
{
  "slug": "dijital-baski",
  "name": "Dijital Baskı",
  "shortDescription": "Kısa açıklama (max 200 karakter)",
  "description": "Uzun açıklama",
  "iconKey": "printer",
  "displayOrder": 1,
  "isActive": true
}
```
**Validation**: `slug` required, 2–120 chars, lowercase kebab-case pattern `^[a-z0-9]+(-[a-z0-9]+)*$`, unique (else `409 CONFLICT`); `name` required 2–150; `shortDescription` required 2–200; `description` required, min 2; `iconKey` required 2–50; `displayOrder` required, integer ≥ 0; `isActive` required boolean.

**Response `201`**: full DTO as in 10.1, with `id`/`createdAt`/`updatedAt` populated.
**Response `400`**: `VALIDATION_ERROR`. **Response `409`**: `CONFLICT` (`message`: `"Bu slug zaten kullanılıyor."`).

### 10.3 `GET /api/admin/services/{id}`
**Response `200`**: full DTO. **Response `404`**: `NOT_FOUND`.

### 10.4 `PUT /api/admin/services/{id}`
Same request/validation shape as 10.2 (full replace, all fields required). **Response `200`**: updated DTO. **Response `404`** / **`400`** / **`409`** as above.

### 10.5 `DELETE /api/admin/services/{id}`
**Response `204`**. **Response `404`**: `NOT_FOUND`. No FK dependents for services, so no `409` case here.

---

## 11. Admin — Categories `/api/admin/categories`

Same CRUD shape as §10, adapted to category fields.

### 11.1 `GET /api/admin/categories`
**Response `200`**: bare array, all categories.
```json
[
  {
    "id": 1, "slug": "kirtasiye-urunleri", "name": "Kırtasiye Ürünleri",
    "description": "...", "imageUrl": "https://...",
    "displayOrder": 1, "isActive": true,
    "createdAt": "2026-08-24T09:00:00Z", "updatedAt": "2026-08-24T09:00:00Z"
  }
]
```

### 11.2 `POST /api/admin/categories`
**Request**
```json
{
  "slug": "kirtasiye-urunleri",
  "name": "Kırtasiye Ürünleri",
  "description": "Kategori açıklaması (opsiyonel)",
  "imageUrl": "https://.../kategori.jpg",
  "displayOrder": 1,
  "isActive": true
}
```
**Validation**: `slug` required, same pattern/uniqueness as services; `name` required 2–150; `description` optional, max 2000; `imageUrl` optional, valid URL, max 500 chars; `displayOrder` required ≥ 0; `isActive` required boolean.

**Response `201`**: full DTO. **`400`** / **`409`** as in §10.2.

### 11.3 `GET /api/admin/categories/{id}` — **`200`** full DTO / **`404`**.

### 11.4 `PUT /api/admin/categories/{id}` — same request shape as 11.2. **`200`** / **`404`** / **`400`** / **`409`**.

### 11.5 `DELETE /api/admin/categories/{id}`
**Response `204`** if no products reference it.
**Response `409` `CONFLICT`** if products exist with this `category_id` — message: `"Bu kategoriye bağlı ürünler bulunduğu için silinemiyor. Önce ürünleri başka bir kategoriye taşıyın veya silin."`
**Response `404`**: `NOT_FOUND`.

---

## 12. Admin — Products `/api/admin/products`

### 12.1 `GET /api/admin/products?page=0&size=20&categoryId={id}`
Paginated envelope (§2), all products regardless of `isActive`. `categoryId` optional filter.

**Response `200`**
```json
{
  "content": [
    {
      "id": 10, "slug": "kisiye-ozel-kupa-baski", "name": "Kişiye Özel Kupa Baskı",
      "description": "...", "imageUrl": "https://...",
      "price": null, "stockStatus": "IN_STOCK",
      "category": { "id": 6, "slug": "kisiye-ozel-baski-urunleri", "name": "Kişiye Özel Baskı Ürünleri" },
      "displayOrder": 1, "isActive": true,
      "createdAt": "2026-08-24T09:00:00Z", "updatedAt": "2026-08-24T09:00:00Z"
    }
  ],
  "page": 0, "size": 20, "totalElements": 14, "totalPages": 1
}
```

### 12.2 `POST /api/admin/products`
**Request**
```json
{
  "categoryId": 6,
  "slug": "kisiye-ozel-kupa-baski",
  "name": "Kişiye Özel Kupa Baskı",
  "description": "Ürün açıklaması (opsiyonel)",
  "imageUrl": "https://.../kupa.jpg",
  "price": null,
  "stockStatus": "IN_STOCK",
  "displayOrder": 1,
  "isActive": true
}
```
Note: request uses `categoryId` (a plain number); response uses a nested `category` object — this is the one intentional asymmetry in the contract, standard REST practice (write by id, read with the expanded relation).

**Validation**: `categoryId` required, must reference an existing category (else `400 VALIDATION_ERROR`, field `categoryId`, message `"Geçerli bir kategori seçiniz."` — not `404`, because the category id is a field on the request body, not a path variable); `slug` required, 2–150 chars, same kebab-case pattern, unique; `name` required 2–200; `description` optional, max 4000; `imageUrl` optional, valid URL, max 500; `price` optional, if present must be ≥ 0, max 2 decimal places; `stockStatus` required, one of `IN_STOCK`/`OUT_OF_STOCK`/`ON_ORDER`; `displayOrder` required ≥ 0; `isActive` required boolean.

**Response `201`**: full DTO (as in 12.1 content item). **`400`** / **`409`** (duplicate slug) as before.

### 12.3 `GET /api/admin/products/{id}` — **`200`** full DTO / **`404`**.

### 12.4 `PUT /api/admin/products/{id}` — same request shape as 12.2. **`200`** / **`404`** / **`400`** / **`409`**.

### 12.5 `DELETE /api/admin/products/{id}` — **`204`** / **`404`**. (No FK dependents on products.)

---

## 13. Admin — Contact messages `/api/admin/contact-messages`

Read/triage only — messages are created solely via the public §7 endpoint.

### 13.1 `GET /api/admin/contact-messages?status={NEW|READ}&page=0&size=20`
`status` optional filter. Ordered `status = 'NEW' first, then createdAt DESC` (unread-first, newest-first) when no filter is given; when filtered, just `createdAt DESC`.

**Response `200`**
```json
{
  "content": [
    {
      "id": 55, "name": "Ahmet Yılmaz", "phone": "0555 123 45 67",
      "email": "ahmet@example.com", "subject": "Kurumsal teklif talebi",
      "message": "Merhaba, ofisimiz için...", "status": "NEW",
      "createdAt": "2026-08-24T10:15:30.123Z"
    }
  ],
  "page": 0, "size": 20, "totalElements": 3, "totalPages": 1
}
```

### 13.2 `GET /api/admin/contact-messages/{id}` — **`200`** full DTO / **`404`**.

### 13.3 `PATCH /api/admin/contact-messages/{id}/status`
Marks a message read (or, if ever needed, back to unread) — the only mutable field on a message.

**Request**
```json
{ "status": "READ" }
```
**Validation**: `status` required, one of `NEW`/`READ`.

**Response `200`**: updated full DTO. **`400`**: `VALIDATION_ERROR`. **`404`**: `NOT_FOUND`.

### 13.4 `DELETE /api/admin/contact-messages/{id}`
**Response `204`** / **`404`**. (Housekeeping — e.g. deleting spam.)

---

## 14. Admin — Site settings `/api/admin/site-settings`

### 14.1 `GET /api/admin/site-settings`
**Response `200`**: identical shape to public §8.1 (there is nothing private in this object; the admin variant exists simply so `/admin` doesn't depend on an unauthenticated endpoint for its own dashboard).

### 14.2 `PUT /api/admin/site-settings`
Full replace of all 10 keys in one call (simplest mental model for an admin "site settings" form — no partial-PATCH semantics needed here).

**Request**: identical shape to the `GET` response (all 10 fields; string values, `""` allowed, none may be `null` — omit-as-empty-string instead).

**Validation**: `siteName`, `phone`, `address` required non-blank; `websiteUrl`, `whatsappNumber`, `instagramUrl`, `facebookUrl`, `workingHours`, `mapEmbedUrl`, `footerNote` optional (may be `""`); any provided URL field (`websiteUrl`, `instagramUrl`, `facebookUrl`, `mapEmbedUrl`) if non-empty must be a valid URL.

**Response `200`**: the updated object, same shape. **Response `400`**: `VALIDATION_ERROR`.

---

## 15. Full endpoint index

| Method | Path | Auth | Success |
|---|---|---|---|
| GET | `/api/services` | public | 200 |
| GET | `/api/services/{slug}` | public | 200 |
| GET | `/api/categories` | public | 200 |
| GET | `/api/categories/{slug}` | public | 200 |
| GET | `/api/products` | public | 200 |
| GET | `/api/products/{slug}` | public | 200 |
| POST | `/api/contact` | public | 201 |
| GET | `/api/site-settings` | public | 200 |
| POST | `/api/admin/auth/login` | public | 200 |
| GET | `/api/admin/services` | admin | 200 |
| POST | `/api/admin/services` | admin | 201 |
| GET | `/api/admin/services/{id}` | admin | 200 |
| PUT | `/api/admin/services/{id}` | admin | 200 |
| DELETE | `/api/admin/services/{id}` | admin | 204 |
| GET | `/api/admin/categories` | admin | 200 |
| POST | `/api/admin/categories` | admin | 201 |
| GET | `/api/admin/categories/{id}` | admin | 200 |
| PUT | `/api/admin/categories/{id}` | admin | 200 |
| DELETE | `/api/admin/categories/{id}` | admin | 204 |
| GET | `/api/admin/products` | admin | 200 |
| POST | `/api/admin/products` | admin | 201 |
| GET | `/api/admin/products/{id}` | admin | 200 |
| PUT | `/api/admin/products/{id}` | admin | 200 |
| DELETE | `/api/admin/products/{id}` | admin | 204 |
| GET | `/api/admin/contact-messages` | admin | 200 |
| GET | `/api/admin/contact-messages/{id}` | admin | 200 |
| PATCH | `/api/admin/contact-messages/{id}/status` | admin | 200 |
| DELETE | `/api/admin/contact-messages/{id}` | admin | 204 |
| GET | `/api/admin/site-settings` | admin | 200 |
| PUT | `/api/admin/site-settings` | admin | 200 |

30 endpoints total.
