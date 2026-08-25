import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { resolveBaseUrl, type RevalidateTag } from "@/lib/api";

const ALLOWED_TAGS: readonly RevalidateTag[] = ["services", "categories", "products", "site-settings"];

/**
 * Internal, admin-triggered on-demand revalidation for the public site's ISR
 * cache. The admin panel calls the Spring Boot backend directly from the
 * browser (no BFF/proxy for CRUD — see `docs/ARCHITECTURE.md` §5), so
 * Next.js has no natural signal when admin content changes. This endpoint
 * gives it one: after a successful admin write, `src/lib/api.ts` fires a
 * best-effort request here so the change is visible on the public site
 * immediately, instead of waiting out the `REVALIDATE_SECONDS` fallback.
 *
 * Not part of the public API contract (`docs/API_CONTRACT.md`) — this is a
 * frontend-internal concern.
 *
 * Auth: we don't hold the backend's JWT signing secret here, so instead of
 * verifying the token ourselves we forward it as-is to an existing
 * JWT-protected admin endpoint and trust the backend's 200/401 verdict.
 */
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return NextResponse.json({ error: "Yetkilendirme başlığı eksik." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const tag = (body as { tag?: unknown } | null)?.tag;
  if (typeof tag !== "string" || !ALLOWED_TAGS.includes(tag as RevalidateTag)) {
    return NextResponse.json({ error: "Geçersiz veya eksik 'tag' alanı." }, { status: 400 });
  }

  const baseUrl = resolveBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ error: "API adresi yapılandırılmamış." }, { status: 500 });
  }

  let authCheck: Response;
  try {
    authCheck = await fetch(`${baseUrl}/api/admin/site-settings`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ error: "Sunucuya ulaşılamıyor." }, { status: 502 });
  }

  if (authCheck.status === 401) {
    return NextResponse.json({ error: "Geçersiz veya süresi dolmuş oturum." }, { status: 401 });
  }
  if (!authCheck.ok) {
    return NextResponse.json({ error: "Yetkilendirme doğrulanamadı." }, { status: 502 });
  }

  // `{ expire: 0 }` forces immediate expiration (rather than `"max"`'s mark-as-stale +
  // stale-while-revalidate semantics), since this is an external caller (the admin panel)
  // that needs the next public page load to reflect the change right away.
  revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag });
}
