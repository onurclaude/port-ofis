# FRONTEND_SPEC — Port Ofis Kırtasiye

Brand: premium stationery + professional printing studio + corporate office solutions. Black/near-black backgrounds, gold as an accent only (never a dominant fill), fountain-pen "P" mark. Full visual language (palette, do's/don'ts, component list) is already defined for the frontend engineer's own brief — this document defines **content structure, data source, and state behavior per page**, which that brief does not cover.

Global elements on every public page: **Navbar** (Ana Sayfa, Hizmetler, Ürünler, Baskı Merkezi, Kurumsal, İletişim + CTA "Bize Ulaşın") and **Footer** (address, phone, quick links, socials from `/api/site-settings`, footer note). Both fetch `GET /api/site-settings` once (layout-level), not per page.

---

## 1. Ana Sayfa (`/`)

**Purpose**: brand-forward introduction; a taste of every other page, driving traffic onward.

**Section order** (fixed, per the design brief — a composed narrative, not a repeated card grid):
1. Hero — headline "Kırtasiyeden Daha Fazlası.", subhead "Kırtasiye, dijital baskı, kurumsal çözümler ve kişiye özel ürünler tek noktada.", CTAs "Hizmetleri İncele" (→ `/hizmetler`) and "Bize Ulaşın" (→ `/iletisim`). Static content, no API call.
2. Selected Services — a curated subset (e.g. first 4–6 by `displayOrder`) of `GET /api/services`, each linking to `/hizmetler#{slug}` or `/hizmetler`.
3. Printing Center teaser — static copy summarizing Baskı Merkezi, CTA → `/baski-merkezi`.
4. Product Categories — from `GET /api/categories`, each card links to `/urunler?category={slug}`.
5. Corporate Solutions teaser — static copy, CTA "Kurumsal Teklif Al" → `/iletisim` (or `/kurumsal`).
6. Why Port Ofis — static trust-building copy (no API call).
7. Location/Contact block — address/phone from `/api/site-settings` (already fetched at layout level), map, CTA → `/iletisim`.
8. Footer.

**Responsive**: hero stacks to single-column under 768px; service/category sections go from multi-column grid (desktop) to horizontal scroll or single-column stack (mobile) — engineer's call on which, consistent with "not a repeated card grid" direction.

**Required API calls**: `GET /api/services` (for §2), `GET /api/categories` (for §4). `GET /api/site-settings` at layout level.

**Loading**: skeleton/placeholder blocks for the services and categories sections while their fetches resolve (only relevant for client-side re-fetch scenarios; if server-rendered, this is effectively instant and can be omitted).
**Error**: if services or categories fail to load, that section collapses gracefully to a static fallback message ("Hizmetlerimizi şu anda görüntüleyemiyoruz.") — must not break the rest of the page.
**Empty**: if `/api/services` or `/api/categories` returns `[]` (shouldn't happen given required seed data, but must be handled), show nothing more alarming than "Yakında burada."-style copy, not a broken layout.

---

## 2. Hizmetler (`/hizmetler`)

**Purpose**: full list of all 6 services with real descriptions.

**Section order**: Page hero/heading ("Hizmetlerimiz") → full service list/grid (all active services, `displayOrder` ASC) → closing CTA block ("Aklınıza takılan bir şey mi var?" → `/iletisim`) → Footer.

**Responsive**: grid 3 columns (desktop) → 2 (tablet) → 1 (mobile), or an alternating editorial layout — engineer's call, consistent with brand direction (avoid "walls of identical rounded cards").

**CTAs**: each service item may link to an anchor or detail state; final CTA → `/iletisim`.

**Required API calls**: `GET /api/services`.

**Loading**: skeleton list while fetching (SSR preferred — see `docs/ARCHITECTURE.md` §4 — so this mostly applies to any client-side revalidation).
**Error**: full-page error state with a retry action ("Hizmetler yüklenemedi, tekrar deneyin.") since this page has no content without the API.
**Empty**: "Şu anda listelenecek hizmet bulunmuyor." message (should not occur given required seed data — still must not crash).

---

## 3. Ürünler (`/urunler`)

**Purpose**: browse product categories and filter products within them. **No cart, no price-driven UX** — this is a catalog, not a store.

**Section order**: Page hero/heading ("Ürünlerimiz") → category filter (tabs or pill list, from `/api/categories`, "Tümü" option included client-side) → product grid (from `/api/products`, paginated) → pagination controls (if `totalPages > 1`) → Footer.

**Responsive**: category filter becomes a horizontal-scroll pill row on mobile; product grid 4 → 3 → 2 → 1 columns across breakpoints.

**CTAs**: none transactional (no "add to cart"); each product card can link to a lightweight detail state (modal or dedicated block) showing the full `description`/`imageUrl` — a full separate product detail route is not required by scope, a client-side expand/modal is sufficient.

**Required API calls**: `GET /api/categories` (filter list), `GET /api/products?categorySlug=&page=&size=` (re-fetched whenever the selected category or page changes — client-side fetch, since this is genuinely interactive).

**Loading**: skeleton grid while `/api/products` is in flight after a filter/page change.
**Error**: inline error banner above the grid ("Ürünler yüklenemedi.") with a retry button; category filter itself stays usable.
**Empty**: selecting a category with zero products shows "Bu kategoride henüz ürün bulunmuyor." inside the grid area, filter/pagination controls remain visible and usable.

---

## 4. Baskı Merkezi (`/baski-merkezi`)

**Purpose**: dedicated page for "Profesyonel Dijital Baskı Merkezi" — this is primarily **static content** describing the print center's offerings (renkli/siyah-beyaz çıktı, fotokopi, tarama, kupa baskı, fotoğraf baskı, kartvizit, broşür, etiket, kaşe, kişiye özel tasarım), since these are not individually admin-managed entities in this phase's data model (they're a fixed list of offerings, not `products`/`services` rows to avoid schema over-engineering).

**Section order**: Page hero ("Profesyonel Dijital Baskı Merkezi") → offerings list/grid (static content, the items above) → optional "İlgili Hizmetler" strip pulling the `dijital-baski` and `kisiye-ozel-baski` services from `GET /api/services` (by slug) for cross-linking → CTA ("Baskı için Bize Ulaşın" → `/iletisim`) → Footer.

**Responsive**: offerings grid 3 → 2 → 1 columns.

**Required API calls**: optional `GET /api/services` for the cross-link strip only; the rest of the page has no API dependency.

**Loading/Error/Empty**: only relevant to the optional services strip — on failure or empty result, that strip is simply omitted (page remains fully functional without it).

---

## 5. Kurumsal (`/kurumsal`)

**Purpose**: B2B pitch — "İşletmeniz İçin Tek Noktadan Ofis Çözümleri."

**Section order**: Page hero (headline above) → corporate offerings (kurumsal kırtasiye tedariği, kurumsal baskı çözümleri — static copy, can reference relevant `services` entries by slug similarly to Baskı Merkezi) → trust/why-corporate-clients-choose-us block (static) → CTA block, primary button "Kurumsal Teklif Al" → Footer.

**CTA behavior**: "Kurumsal Teklif Al" routes to `/iletisim` with the `subject` field pre-filled to "Kurumsal Teklif Talebi" (query param or client state — implementation detail, not contract-required, purely a UX nicety).

**Responsive**: single-column editorial layout on mobile, two-column (copy + supporting visual) on desktop.

**Required API calls**: optional `GET /api/services` for cross-linking, same treatment as Baskı Merkezi.

**Loading/Error/Empty**: same pattern as §4 — optional strip degrades gracefully, rest of page is static and always renders.

---

## 6. İletişim (`/iletisim`)

**Purpose**: contact info + the contact form — the single most important conversion point on the site, and the entry point of the critical E2E flow.

**Section order**: Page hero ("Bize Ulaşın" / "İletişim") → contact info block (address "Port Ofis Kırtasiye, Eryaman Port AVM, Etimesgut/Ankara", phone "0312 911 81 02", from `/api/site-settings`) + embedded map (`mapEmbedUrl` from settings, if non-empty; otherwise a static map link/placeholder) → contact form → Footer.

**Contact form fields**: Ad Soyad, Telefon, E-posta, Konu, Mesaj — matching `docs/API_CONTRACT.md` §7.1 exactly (field names `name`/`phone`/`email`/`subject`/`message`, same validation rules mirrored client-side).

**CTAs**: form submit button ("Gönder"); phone number is a `tel:` link; address may link to a maps URL.

**Required API calls**: `POST /api/contact` (on submit). `/api/site-settings` already available from layout.

**States** (see `docs/USER_FLOWS.md` Flow 2 for the full step-by-step):
- **Loading**: submit button shows a busy/disabled state; form fields remain visible but not editable.
- **Success**: form clears; exact message shown: *"Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz."*
- **Error (validation, 400)**: inline message per field, mapped from `fieldErrors`.
- **Error (network/500)**: generic Turkish error banner, typed values preserved, submit re-enabled.

**Responsive**: form + info stack single-column on mobile; two-column (info/map left, form right) on desktop.

---

## 7. Admin panel (`/admin/**`)

Same design system, deliberately less decorative (no hero animation, functional density > storytelling). Not indexed by search engines (`noindex`).

### 7.1 `/admin/login`
- Username + password fields, submit → `POST /api/admin/auth/login`.
- **Loading**: submit disabled while in flight.
- **Error**: *"Kullanıcı adı veya şifre hatalı."* inline on `401`.
- **Success**: store token, redirect to `/admin`.

### 7.2 `/admin` (dashboard/overview)
- Simple landing area after login — e.g. counts (services/categories/products/unread messages) pulled from the respective list endpoints, or a simple nav-card layout into the sub-sections. Not specified further — low-risk area, engineer's reasonable judgment, as long as it links into §7.3–7.6.

### 7.3 `/admin/services`, `/admin/categories`, `/admin/products`
- **Layout**: `DataTable` (columns: name, slug, active toggle/badge, display order, actions) + "Yeni Ekle" button opening a create form; row actions "Düzenle"/"Sil".
- **Products table** additionally shows the category name (from the nested `category` object) and a category filter dropdown, and is paginated (`GET /api/admin/products`); services/categories tables are unpaginated per the contract.
- **Required API calls**: the full CRUD set from `docs/API_CONTRACT.md` §10–12 for each respective entity.
- **Loading**: `LoadingState` component while the list fetch is in flight.
- **Error**: `EmptyState`-style error block with retry if the list fetch fails.
- **Empty**: `EmptyState` ("Henüz hizmet eklenmemiş." etc.) with the "Yeni Ekle" CTA prominent.
- **Form validation**: client-side mirrors of the rules in the API contract, plus surfacing of server-side `fieldErrors` and `409` conflict messages (e.g. duplicate slug, category-delete-with-products).

### 7.4 `/admin/messages`
- Table/list of contact messages (`GET /api/admin/contact-messages`), unread (`NEW`) visually distinguished (e.g. bold row / dot indicator), newest-first.
- Filter by status (Tümü / Yeni / Okundu).
- Clicking a message opens its full detail (name/phone/email/subject/message/createdAt) and triggers `PATCH .../{id}/status` to mark it `READ` if it was `NEW`.
- Optional delete action (`DELETE .../{id}`) for spam/housekeeping.
- **Loading/Error/Empty**: same `LoadingState`/error-with-retry/`EmptyState` ("Henüz mesaj yok.") pattern as §7.3.

### 7.5 `/admin/settings`
- Single form, all 10 `site_settings` fields, pre-filled from `GET /api/admin/site-settings`, submitted as a full object via `PUT /api/admin/site-settings`.
- **Loading**: form fields disabled/skeleton while initial `GET` is in flight.
- **Error**: retry banner if the initial `GET` fails; inline field errors on `PUT` `400`.
- **Success**: success toast/banner, form re-populated from the response.

### 7.6 Cross-cutting admin behavior
- Any `/api/admin/**` call returning `401` (expired/invalid token) clears the stored token and redirects to `/admin/login` with a "Oturumunuz sona erdi, lütfen tekrar giriş yapın." message.
- `AdminSidebar` (or equivalent nav) present on all `/admin/**` pages except `/admin/login`: links to Dashboard, Services, Categories, Products, Messages, Settings, and a logout action (clears the token, redirects to login).

---

## 8. Shared component expectations (data/state contracts only — visual spec is in the design brief)

- `LoadingState` — used whenever an API call for a page's primary content is in flight and there's no server-rendered content to show yet.
- `EmptyState` — used whenever a successful API call returns zero items, with page-appropriate copy and (where relevant) a primary action.
- Error banners/blocks — used whenever an API call fails (network error or non-2xx that isn't a form-field validation case), always in Turkish, always with a retry action where retrying makes sense (list fetches) and without one where it doesn't (a completed form submission's terminal error state simply invites re-submission).
- No page may silently show stale/mock data on error — every data-driven section must visibly communicate its loading/error/empty condition per the states defined above.
