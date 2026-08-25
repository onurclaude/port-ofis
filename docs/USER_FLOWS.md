# USER_FLOWS — Port Ofis Kırtasiye

## Flow 1 — Visitor browses services and products (informational)

1. Visitor lands on **Ana Sayfa** (`/`). Sees hero, a curated slice of services, printing center teaser, product category teaser, corporate teaser, "why us," location/contact block.
2. Visitor clicks a service or "Hizmetleri İncele" → **Hizmetler** (`/hizmetler`), which fetches `GET /api/services` and lists all active services.
3. Visitor clicks "Ürünler" in the navbar → **Ürünler** (`/urunler`), which fetches `GET /api/categories` (renders category filter/tabs) and `GET /api/products?categorySlug=...` (renders the filtered product grid). Selecting a different category re-fetches products client-side; no page reload.
4. Visitor clicks "Baskı Merkezi" → static-content page describing the print center's offerings (renkli/siyah-beyaz çıktı, fotokopi, tarama, kupa/fotoğraf baskı, kartvizit, broşür, etiket, kaşe, kişiye özel tasarım), no admin-editable data required beyond what's already in `services`.
5. Visitor clicks "Kurumsal" → corporate solutions page, ends in a "Kurumsal Teklif Al" CTA → routes to Flow 2 (İletişim / contact form), optionally pre-filling `subject` with "Kurumsal Teklif Talebi" as a UX nicety (not contract-required).

No login, no error states beyond normal network/API failure handling (see `docs/FRONTEND_SPEC.md` for per-page loading/error/empty states).

---

## Flow 2 — Visitor → Contact form → Admin sees message (CRITICAL, release-blocking)

This is the flow `qa-integration-engineer` treats as release-blocking. Every step must work end to end.

1. Visitor navigates to **İletişim** (`/iletisim`) (or arrives via a "Bize Ulaşın" / "Kurumsal Teklif Al" CTA from another page).
2. Page renders address, phone, map, and a contact form with fields: Ad Soyad (`name`), Telefon (`phone`), E-posta (`email`), Konu (`subject`), Mesaj (`message`).
3. Visitor fills the form. Frontend performs client-side validation matching `docs/API_CONTRACT.md` §7.1 rules (required fields, email format, length limits) before allowing submit — fast feedback, but **not a substitute** for server-side validation.
4. Visitor submits. Frontend shows a loading state on the submit button (disabled, spinner/label change) and calls `POST /api/contact` with the exact request DTO from §7.1.
5. **Success path**: backend validates, persists a new row to `contact_messages` with `status = 'NEW'`, responds `201` with the created resource. Frontend clears the form and shows the exact success message: *"Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz."*
6. **Validation failure path**: backend responds `400 VALIDATION_ERROR` with `fieldErrors`. Frontend maps each `fieldErrors[].field` to the corresponding form field and shows its `message` inline; form is not cleared; submit re-enabled.
7. **Network/server failure path**: frontend shows a generic Turkish error message (e.g. *"Mesajınız gönderilemedi, lütfen tekrar deneyin."*) without losing the visitor's typed input; submit re-enabled.
8. Some time later, **Admin** logs into `/admin` (Flow 3), opens **Mesajlar** (`/admin/messages`), which calls `GET /api/admin/contact-messages?status=NEW` (or unfiltered, unread-first). The new message from step 5 appears, showing name/phone/email/subject/message/createdAt, with a "yeni" (unread) indicator.
9. Admin opens the message (or an explicit "okundu işaretle" action) → frontend calls `PATCH /api/admin/contact-messages/{id}/status` with `{ "status": "READ" }`. List/detail updates to reflect the new status.

**Definition of done for this flow**: step 5's `201` response must correspond to an actual persisted row queryable in step 8 — QA verifies this by checking the database directly, not just trusting the UI.

---

## Flow 3 — Admin login

1. Admin navigates to `/admin` (or any `/admin/*` route) while unauthenticated → redirected to `/admin/login`.
2. Admin enters username/password → frontend calls `POST /api/admin/auth/login`.
3. **Success**: backend returns `{ token, expiresAt, username }`. Frontend stores the token (per `docs/ARCHITECTURE.md` §6 — `localStorage` or equivalent) and redirects to `/admin` (dashboard/overview).
4. **Failure (401)**: frontend shows *"Kullanıcı adı veya şifre hatalı."* inline, form not cleared for username, password field cleared.
5. Every subsequent `/admin/**` page load attaches `Authorization: Bearer <token>` to all `/api/admin/**` calls. If any call returns `401` (token expired mid-session), frontend clears the stored token and redirects to `/admin/login` with a message that the session expired.

---

## Flow 4 — Admin manages services / categories / products (CRUD)

Identical shape for all three entities; described once.

1. Admin opens `/admin/services` (or `/categories`, `/products`) → frontend calls the corresponding `GET /api/admin/...` list endpoint, rendered as a table (name, slug, active status, display order, actions).
2. **Create**: admin clicks "Yeni Ekle" → form (fields per `docs/API_CONTRACT.md` §10.2/11.2/12.2) → submit → `POST .../{entity}`. On `201`, table refreshes/prepends the new row and a success toast shows. On `400`, inline field errors. On `409` (duplicate slug), the `slug` field shows the conflict message from the API.
3. **Edit**: admin clicks a row's "Düzenle" → form pre-filled from `GET .../{id}` → submit → `PUT .../{id}`. Same success/error handling as create.
4. **Toggle active / reorder**: handled through the same edit form (`isActive`, `displayOrder` fields) — no separate endpoint, to avoid multiplying API surface for a small admin tool.
5. **Delete**: admin clicks "Sil" → confirmation dialog → `DELETE .../{id}`. On `204`, row removed from the table. On `409` (category with dependent products), frontend shows the API's conflict message instead of silently failing.
6. For products specifically: the create/edit form's category field is a dropdown populated from `GET /api/admin/categories`, submitting `categoryId`; the table displays the nested `category.name` from the list response.

---

## Flow 5 — Admin manages site settings

1. Admin opens `/admin/settings` → frontend calls `GET /api/admin/site-settings`, pre-fills a form with all 10 fields (site name, phone, address, website, WhatsApp, Instagram, Facebook, working hours, map embed URL, footer note).
2. Admin edits one or more fields, submits → `PUT /api/admin/site-settings` with the full object (all 10 fields, per §14.2 — this is a full replace, not a partial patch).
3. **Success**: `200` with the updated object, form re-populated from the response, success toast.
4. **Validation failure**: `400 VALIDATION_ERROR`, inline field errors (e.g. an invalid URL in `instagramUrl`).
5. Public pages that display these values (footer, İletişim page) reflect the change on next fetch (SSR/ISR revalidation window — not necessarily instant, per `docs/ARCHITECTURE.md` §4).

---

## Flow 6 — Empty / edge states a visitor or admin can hit

- **Ürünler page, category with zero products**: `GET /api/products?categorySlug=X` returns `200` with empty `content` — frontend shows an empty-state message, not a spinner forever or a false error.
- **Hizmetler page with zero active services** (shouldn't happen given required seed data, but must not crash): empty-state message.
- **Admin messages inbox, zero messages**: empty-state message, not a broken table.
- **Admin product create with a since-deleted category** pre-selected: `400 VALIDATION_ERROR` on `categoryId` → frontend shows the message and refreshes the category dropdown.
