"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ALLERGEN_LABELS,
  DIET_TAGS,
  formatMenuPrice,
  type MenuCategory,
  type MenuProduct,
  type MenuTenant,
} from "./menu-data";

// Ported from cafe-menu's src/components/menu/menu-app.tsx. Differences from
// the original: data is static (menu-data.ts), cafe-menu's Tailwind v3 theme
// helpers are inlined as arbitrary values, and every sticky/fixed element is
// pushed down by the 44px (top-11) "canlı örnek" preview bar rendered above
// the demo by app/web-tasarimlari/[slug]/page.tsx.

const PREVIEW_BAR_HEIGHT = 44;
const STICKY_OFFSET = 118 + PREVIEW_BAR_HEIGHT;
const STICKY_OFFSET_DESKTOP = 40 + PREVIEW_BAR_HEIGHT;

const NO_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";
const HEADING = "font-display";

type Sheet = "search" | "filter" | "categories" | "info" | null;

export function MenuApp({ tenant, menu }: { tenant: MenuTenant; menu: MenuCategory[] }) {
  const [query, setQuery] = useState("");
  const [dietFilters, setDietFilters] = useState<Set<string>>(new Set());
  const [activeCat, setActiveCat] = useState(menu[0]?.id ?? "");
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selected, setSelected] = useState<MenuProduct | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const nonEmptyCats = useMemo(() => menu.filter((c) => c.products.length > 0), [menu]);

  const filteredMenu = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    return nonEmptyCats
      .map((c) => ({
        ...c,
        products: c.products.filter((p) => {
          for (const tag of dietFilters) {
            if (!p.dietTags.includes(tag)) return false;
          }
          if (!q) return true;
          return `${p.name} ${p.description} ${p.ingredients}`.toLocaleLowerCase("tr-TR").includes(q);
        }),
      }))
      .filter((c) => c.products.length > 0);
  }, [nonEmptyCats, query, dietFilters]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (!q) return [];
    return nonEmptyCats
      .flatMap((c) => c.products.map((p) => ({ ...p, catName: c.name })))
      .filter((p) => `${p.name} ${p.description}`.toLocaleLowerCase("tr-TR").includes(q));
  }, [nonEmptyCats, query]);

  // Highlights the category currently under the sticky header and keeps its
  // pill scrolled into view in the mobile rail.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.getAttribute("data-cat-id");
        if (id) {
          setActiveCat(id);
          pillRefs.current[id]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      },
      { rootMargin: `-${STICKY_OFFSET}px 0px -55% 0px`, threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [filteredMenu]);

  function goToCategory(id: string) {
    const el = sectionRefs.current[id];
    if (el) {
      const offset = window.innerWidth >= 1024 ? STICKY_OFFSET_DESKTOP : STICKY_OFFSET;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset + 1, behavior: "smooth" });
    }
    setSheet(null);
  }

  function toggleDiet(tag: string) {
    setDietFilters((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setDietFilters(new Set());
  }

  return (
    <div className="min-h-screen pt-11 font-sans" style={{ background: "var(--bg)", color: "var(--ink)" }}>
      <div className="lg:mx-auto lg:flex lg:max-w-6xl lg:items-start lg:gap-10 lg:px-8 lg:pb-20 lg:pt-10">
        {/* Desktop sidebar — search, categories and filters live here instead of sheets */}
        <aside className="hidden lg:sticky lg:top-[84px] lg:block lg:w-[272px] lg:flex-none">
          <div className="flex items-center gap-3.5">
            <LogoMark tenant={tenant} className="h-16 w-16 text-3xl" />
            <div className="min-w-0">
              <div className={`${HEADING} truncate text-[22px] leading-tight`}>{tenant.name}</div>
              <div className="mt-0.5 text-[10.5px] font-bold" style={{ color: "var(--success)" }}>
                ● {tenant.hoursText}
              </div>
            </div>
          </div>

          <div
            className="mt-5 flex h-11 items-center gap-2.5 rounded-xl border px-3.5"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }}
          >
            <span className="font-mono text-[13px]" style={{ color: "var(--gold)" }} aria-hidden="true">
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Menüde ara"
              aria-label="Menüde ara"
              className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: "var(--ink)" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Aramayı temizle"
                className="font-mono text-[12px]"
                style={{ color: "var(--ink-3)" }}
              >
                ✕
              </button>
            )}
          </div>

          <nav className="mt-5 flex flex-col gap-0.5" aria-label="Kategoriler">
            {nonEmptyCats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goToCategory(c.id)}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13.5px] font-bold transition-colors"
                style={c.id === activeCat ? { background: "var(--gold-soft)", color: "var(--gold)" } : { color: "var(--ink-2)" }}
              >
                <span className="truncate">{c.name}</span>
                <span className="font-mono text-[10.5px] font-semibold" style={{ color: "var(--ink-3)" }}>
                  {String(c.products.length).padStart(2, "0")}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--line)" }}>
            <SmallLabel>Beslenme tercihi</SmallLabel>
            <DietToggles active={dietFilters} onToggle={toggleDiet} size="sm" />
          </div>

          <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--line)" }}>
            {tenant.address && <InfoRow k="Adres" v={tenant.address} small />}
            {tenant.hoursText && <InfoRow k="Saatler" v={tenant.hoursText} small />}
            {tenant.wifiPassword && <InfoRow k="Wi-Fi" v={tenant.wifiPassword} small />}
          </div>
        </aside>

        {/* Main column: full mobile experience, becomes the content column on desktop */}
        <div className="mx-auto max-w-2xl pb-32 lg:mx-0 lg:max-w-none lg:flex-1 lg:pb-0">
          {/* Mobile hero */}
          <div
            className="relative lg:hidden"
            style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--gold) 10%, var(--bg)) 0%, var(--bg) 100%)" }}
          >
            <div className="flex items-start justify-between px-6 pt-6">
              <LogoMark tenant={tenant} className="h-20 w-20 text-4xl" />
              <button
                type="button"
                onClick={() => setSheet("info")}
                aria-label="Restoran bilgisi"
                className="grid h-9 w-9 place-items-center rounded-full border font-mono text-sm"
                style={{ background: "var(--surface)", borderColor: "var(--line)", color: "var(--gold)" }}
              >
                ⓘ
              </button>
            </div>

            <div className="px-6 pt-4">
              <h1 className={`${HEADING} text-[36px] leading-[1.05]`}>{tenant.name}</h1>
              {tenant.description && (
                <p className="mt-2 max-w-sm text-[13px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                  {tenant.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10.5px] font-bold"
                  style={{ background: "color-mix(in srgb, var(--success) 16%, transparent)", color: "var(--success)" }}
                >
                  ● {tenant.hoursText}
                </span>
                {tenant.address && (
                  <span className="text-[11.5px]" style={{ color: "var(--ink-2)" }}>
                    {tenant.address}
                  </span>
                )}
              </div>
            </div>
            <div className="h-5" />
          </div>

          {/* Mobile sticky search + category rail */}
          <div
            className="sticky top-11 z-20 pb-3 pt-2.5 lg:hidden"
            style={{ background: "linear-gradient(180deg, var(--bg) 68%, transparent)" }}
          >
            <div className="flex gap-2 px-6 pb-2.5">
              <button
                type="button"
                onClick={() => setSheet("search")}
                className="flex h-10 flex-1 items-center gap-2 rounded-xl border px-3.5 text-left"
                style={{ background: "var(--surface)", borderColor: "var(--line)" }}
              >
                <span className="font-mono text-[13px]" style={{ color: "var(--gold)" }} aria-hidden="true">
                  ⌕
                </span>
                <span className="text-[13px]" style={{ color: "var(--ink-3)" }}>
                  {query || "Menüde ara"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSheet("filter")}
                aria-label="Filtreler"
                className="relative grid h-10 w-10 place-items-center rounded-xl border font-mono text-[13px]"
                style={{ background: "var(--surface)", borderColor: "var(--line)", color: "var(--gold)" }}
              >
                ⚙
                {dietFilters.size > 0 && (
                  <span
                    className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full text-[9.5px] font-extrabold"
                    style={{ background: "var(--gold)", color: "var(--on-gold)" }}
                  >
                    {dietFilters.size}
                  </span>
                )}
              </button>
            </div>
            <div className={`flex gap-2 overflow-x-auto px-6 ${NO_SCROLLBAR}`}>
              {nonEmptyCats.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  ref={(el) => {
                    pillRefs.current[c.id] = el;
                  }}
                  onClick={() => goToCategory(c.id)}
                  className="flex-none whitespace-nowrap rounded-full px-4 py-2 text-[12.5px] font-bold transition-colors"
                  style={
                    c.id === activeCat
                      ? { background: "var(--gold)", color: "var(--on-gold)" }
                      : {
                          background: "color-mix(in srgb, var(--ink) 6%, transparent)",
                          color: "var(--ink-2)",
                          border: "1px solid var(--line)",
                        }
                  }
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {dietFilters.size > 0 && (
            <div className="flex flex-wrap items-center gap-2 px-6 pb-2 lg:hidden">
              {Array.from(dietFilters).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleDiet(tag)}
                  className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold"
                  style={{ background: "var(--gold-soft)", color: "var(--gold)" }}
                >
                  {tag} ✕
                </button>
              ))}
              <button
                type="button"
                onClick={() => setDietFilters(new Set())}
                className="text-[11px] font-semibold"
                style={{ color: "var(--ink-3)" }}
              >
                Temizle
              </button>
            </div>
          )}

          {filteredMenu.length === 0 && (
            <div className="px-10 py-16 text-center lg:px-0">
              <div className={`${HEADING} text-[23px]`}>Sonuç yok</div>
              <p className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                Seçtiğiniz filtrelere uyan ürün bulunamadı.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-block rounded-xl px-4 py-2.5 text-[12.5px] font-bold"
                style={{ background: "var(--gold)", color: "var(--on-gold)" }}
              >
                Filtreleri temizle
              </button>
            </div>
          )}

          {filteredMenu.map((c) => (
            <div
              key={c.id}
              data-cat-id={c.id}
              ref={(el) => {
                sectionRefs.current[c.id] = el;
              }}
              className="px-6 pb-7 pt-3.5 lg:px-0 lg:pb-12 lg:pt-0"
            >
              <div className="mb-1 flex items-baseline gap-2.5 lg:mb-4">
                <h2 className={`${HEADING} text-[26px] leading-[1.2] lg:text-[32px]`}>{c.name}</h2>
                <div className="h-px flex-1" style={{ background: "var(--line)" }} />
                <span className="font-mono text-[10.5px] font-semibold" style={{ color: "var(--ink-3)" }}>
                  {String(c.products.length).padStart(2, "0")}
                </span>
              </div>

              {/* Mobile: list rows */}
              <div className="lg:hidden">
                {c.products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p)}
                    className="flex w-full gap-3.5 border-b py-[18px] text-left"
                    style={{ borderColor: "var(--line)" }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[15.5px] font-bold tracking-tight">{p.name}</span>
                        {p.badge && <Badge label={p.badge} />}
                      </div>
                      {p.description && (
                        <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                          {p.description}
                        </p>
                      )}
                      <PriceLine product={p} tenant={tenant} />
                    </div>
                    <Thumb src={p.imageUrl} className="h-[82px] w-[82px] flex-none rounded-2xl" />
                  </button>
                ))}
              </div>

              {/* Desktop: card grid */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-5 xl:grid-cols-3">
                {c.products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p)}
                    className="flex flex-col overflow-hidden rounded-[18px] border text-left transition-transform hover:-translate-y-0.5"
                    style={{ background: "var(--surface)", borderColor: "var(--line)" }}
                  >
                    <Thumb src={p.imageUrl} className="h-[160px] w-full" />
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[15px] font-bold tracking-tight">{p.name}</span>
                        {p.badge && <Badge label={p.badge} />}
                      </div>
                      {p.description && (
                        <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                          {p.description}
                        </p>
                      )}
                      <div className="mt-auto">
                        <PriceLine product={p} tenant={tenant} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="px-6 pb-6 text-center lg:px-0 lg:pt-4 lg:text-left">
            <div className="text-[11px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
              {tenant.name} {tenant.address ? `· ${tenant.address}` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only floating bottom nav */}
      <div
        className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-1.5 whitespace-nowrap rounded-full p-1.5 backdrop-blur-xl lg:hidden"
        style={{ background: "var(--surface-2)", border: "1px solid var(--gold-soft)", boxShadow: "0 16px 40px -10px rgba(0,0,0,.6)" }}
      >
        <button
          type="button"
          onClick={() => setSheet("search")}
          className="flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold"
          style={{ background: "var(--gold)", color: "var(--on-gold)" }}
        >
          ⌕ Ara
        </button>
        <button
          type="button"
          onClick={() => setSheet("filter")}
          className="rounded-full px-4 py-2.5 text-[13px] font-bold"
          style={{ color: "var(--ink-2)" }}
        >
          Filtrele
        </button>
        <button
          type="button"
          onClick={() => setSheet("categories")}
          aria-label="Kategoriler"
          className="rounded-full px-3.5 py-2.5 text-[13px] font-bold"
          style={{ color: "var(--ink-2)" }}
        >
          ☰
        </button>
      </div>

      {(sheet || selected) && (
        <div
          onClick={() => {
            setSheet(null);
            setSelected(null);
          }}
          aria-hidden="true"
          className="fixed inset-0 z-40 animate-in fade-in-0 duration-200"
          style={{ background: "rgba(0,0,0,.55)" }}
        />
      )}

      {sheet === "search" && (
        <div
          className="fixed inset-x-0 bottom-0 top-11 z-50 flex flex-col animate-in fade-in-0 duration-200 lg:hidden"
          style={{ background: "var(--bg)" }}
        >
          <div className="flex items-center gap-2.5 px-4 pb-3 pt-5">
            <div
              className="flex h-11 flex-1 items-center gap-2.5 rounded-xl border px-3.5"
              style={{ background: "var(--surface)", borderColor: "var(--gold-soft)" }}
            >
              <span className="font-mono text-sm" style={{ color: "var(--gold)" }} aria-hidden="true">
                ⌕
              </span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Yemek, malzeme, kategori…"
                aria-label="Menüde ara"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--ink)" }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Aramayı temizle"
                  className="font-mono text-[13px]"
                  style={{ color: "var(--ink-3)" }}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="button" onClick={() => setSheet(null)} className="text-[13px] font-bold" style={{ color: "var(--ink-2)" }}>
              İptal
            </button>
          </div>
          <div className={`flex-1 overflow-y-auto px-5 pb-8 ${NO_SCROLLBAR}`}>
            {query.trim() && searchResults.length === 0 && (
              <div className="px-2 py-16 text-center">
                <div className={`${HEADING} text-[23px]`}>Eşleşme yok</div>
                <p className="mt-2 text-[13px]" style={{ color: "var(--ink-2)" }}>
                  Farklı bir kelime deneyin ya da kategorilere göz atın.
                </p>
              </div>
            )}
            {searchResults.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelected(p);
                  setSheet(null);
                }}
                className="flex w-full items-center gap-3.5 border-b py-3.5 text-left"
                style={{ borderColor: "var(--line)" }}
              >
                <Thumb src={p.imageUrl} className="h-14 w-14 flex-none rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold">{p.name}</div>
                  <div className="mt-1 text-[11.5px]" style={{ color: "var(--ink-2)" }}>
                    {p.catName}
                  </div>
                </div>
                <span className="text-[13.5px] font-bold" style={{ color: "var(--gold)" }}>
                  {formatMenuPrice(p.price, tenant.currency)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {sheet === "filter" && (
        <BottomSheet onClose={() => setSheet(null)} title="Filtreler">
          <SmallLabel>Beslenme tercihi</SmallLabel>
          <div className="mb-5">
            <DietToggles active={dietFilters} onToggle={toggleDiet} />
          </div>
          <PrimaryButton onClick={() => setSheet(null)}>Uygula</PrimaryButton>
        </BottomSheet>
      )}

      {sheet === "categories" && (
        <BottomSheet onClose={() => setSheet(null)} title="Kategoriler">
          <div className={`max-h-[420px] overflow-y-auto ${NO_SCROLLBAR}`}>
            {nonEmptyCats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goToCategory(c.id)}
                className="flex w-full items-center justify-between border-b py-[15px] text-left"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="text-[14px] font-bold">{c.name}</span>
                <span className="font-mono text-[11.5px]" style={{ color: "var(--ink-3)" }}>
                  {String(c.products.length).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {sheet === "info" && (
        <BottomSheet onClose={() => setSheet(null)} title="Restoran bilgisi">
          <InfoRow k="Adres" v={tenant.address || "—"} />
          <InfoRow k="Saatler" v={tenant.hoursText || "—"} />
          {tenant.wifiPassword && <InfoRow k="Wi-Fi şifresi" v={tenant.wifiPassword} />}
          <button
            type="button"
            onClick={() => setSheet(null)}
            className="mt-5 h-12 w-full rounded-2xl border text-[13.5px] font-bold"
            style={{ borderColor: "var(--line)", color: "var(--ink-2)" }}
          >
            Kapat
          </button>
        </BottomSheet>
      )}

      {selected && <ProductSheet product={selected} tenant={tenant} onClose={() => setSelected(null)} />}
    </div>
  );
}

function LogoMark({ tenant, className }: { tenant: MenuTenant; className: string }) {
  return (
    <div
      className={`grid flex-none place-items-center rounded-2xl border ${HEADING} ${className}`}
      style={{ background: "var(--surface)", borderColor: "var(--line)", color: "var(--gold)" }}
    >
      {tenant.name.charAt(0)}
    </div>
  );
}

function SmallLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2.5 font-mono text-[10.5px] font-bold uppercase tracking-widest" style={{ color: "var(--ink-3)" }}>
      {children}
    </div>
  );
}

function PrimaryButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[50px] w-full rounded-2xl text-[14px] font-extrabold"
      style={{ background: "var(--gold)", color: "var(--on-gold)" }}
    >
      {children}
    </button>
  );
}

function DietToggles({
  active,
  onToggle,
  size = "md",
}: {
  active: Set<string>;
  onToggle: (tag: string) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className={`flex flex-wrap ${size === "sm" ? "gap-1.5" : "gap-2"}`}>
      {DIET_TAGS.map((tag) => {
        const on = active.has(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(tag)}
            className={`rounded-lg text-[11.5px] font-semibold ${size === "sm" ? "px-2.5 py-1.5" : "px-3 py-2"}`}
            style={
              on
                ? { background: "var(--ink)", color: "var(--bg)" }
                : { background: "color-mix(in srgb, var(--ink) 6%, transparent)", color: "var(--ink-2)" }
            }
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

function PriceLine({ product, tenant }: { product: MenuProduct; tenant: MenuTenant }) {
  return (
    <div className="mt-2.5 flex items-center gap-3 pt-0.5">
      <span className="text-[15px] font-bold" style={{ color: "var(--gold)" }}>
        {formatMenuPrice(product.price, tenant.currency)}
      </span>
      {product.oldPrice != null && (
        <span className="text-[12.5px] font-medium line-through" style={{ color: "var(--ink-3)" }}>
          {formatMenuPrice(product.oldPrice, tenant.currency)}
        </span>
      )}
      {tenant.showCalories && product.kcal != null && (
        <span className="font-mono text-[11px] font-medium" style={{ color: "var(--ink-3)" }}>
          {product.kcal} kcal
        </span>
      )}
    </div>
  );
}

const HOT_WORDS = ["acı", "spicy", "hot"];
const VEG_WORDS = ["vegan", "vejetaryen", "vegetarian"];

function Badge({ label }: { label: string }) {
  const lower = label.toLocaleLowerCase("tr-TR");
  const tone = HOT_WORDS.some((w) => lower.includes(w))
    ? { background: "color-mix(in srgb, var(--hot) 16%, transparent)", color: "var(--hot)" }
    : VEG_WORDS.some((w) => lower.includes(w))
      ? { background: "color-mix(in srgb, var(--success) 16%, transparent)", color: "var(--success)" }
      : { background: "var(--gold-soft)", color: "var(--gold)" };

  return (
    <span className="inline-flex items-center rounded-md px-2 py-[3px] text-[9.5px] font-bold uppercase tracking-wide" style={tone}>
      {label}
    </span>
  );
}

function Thumb({ src, className, label }: { src: string | null; className?: string; label?: string }) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className ?? ""}`}>
        <Image src={src} alt="" fill sizes="(min-width: 1024px) 320px, 100px" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`grid place-items-center ${className ?? ""}`}
      style={{
        background: "repeating-linear-gradient(135deg, var(--surface-2) 0 9px, var(--surface) 9px 18px)",
        border: "1px solid var(--line)",
      }}
    >
      <span className="font-mono text-[7.5px] tracking-[0.14em]" style={{ color: "var(--ink-3)" }}>
        {label ?? "GÖRSEL"}
      </span>
    </div>
  );
}

function InfoRow({ k, v, small }: { k: string; v: string; small?: boolean }) {
  if (small) {
    return (
      <div className="flex justify-between gap-3 py-1.5">
        <span className="text-[11.5px] font-semibold" style={{ color: "var(--ink-3)" }}>
          {k}
        </span>
        <span className="truncate text-right text-[11.5px] font-semibold">{v}</span>
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-5 border-b py-3" style={{ borderColor: "var(--line)" }}>
      <span className="flex-none text-[12.5px] font-semibold" style={{ color: "var(--ink-3)" }}>
        {k}
      </span>
      <span className="text-right text-[12.5px] font-semibold">{v}</span>
    </div>
  );
}

function BottomSheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl rounded-t-[26px] border-t animate-in fade-in-0 slide-in-from-bottom-4 duration-300 lg:hidden"
      style={{ background: "var(--surface)", borderColor: "var(--gold-soft)", boxShadow: "0 -20px 50px -12px rgba(0,0,0,.6)" }}
    >
      <div className="grid place-items-center pt-2.5">
        <div className="h-1 w-9 rounded-full" style={{ background: "var(--line)" }} />
      </div>
      <div className="flex items-center justify-between px-6 pb-1.5 pt-3.5">
        <h3 className={`${HEADING} text-[24px] leading-[1.1]`}>{title}</h3>
        <button type="button" onClick={onClose} aria-label="Kapat" className="font-mono text-[13px]" style={{ color: "var(--ink-3)" }}>
          ✕
        </button>
      </div>
      <div className="px-6 pb-8 pt-2.5">{children}</div>
    </div>
  );
}

function ProductSheet({ product, tenant, onClose }: { product: MenuProduct; tenant: MenuTenant; onClose: () => void }) {
  const hasStats = tenant.showCalories && product.kcal != null;
  const hasAllergens = tenant.showAllergens && product.allergens.length > 0;
  const hasIngredients = tenant.showIngredients && product.ingredients.trim().length > 0;
  const minimal = !hasStats && !hasAllergens && !hasIngredients && product.dietTags.length === 0;

  return (
    <div
      role="dialog"
      aria-label={product.name}
      className="fixed inset-x-0 bottom-0 top-[92px] z-50 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-t-[26px] border-t animate-in fade-in-0 slide-in-from-bottom-4 duration-300 lg:inset-x-auto lg:right-0 lg:top-11 lg:mx-0 lg:w-[440px] lg:max-w-[440px] lg:rounded-l-[26px] lg:rounded-t-none lg:border-l lg:border-t-0"
      style={{ background: "var(--surface)", borderColor: "var(--gold-soft)", boxShadow: "0 -24px 60px -12px rgba(0,0,0,.7)" }}
    >
      <div className={`flex-1 overflow-y-auto ${NO_SCROLLBAR}`}>
        <div className="relative h-[230px]">
          <Thumb src={product.imageUrl} className="h-full w-full" label="ÜRÜN GÖRSELİ" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-4 top-3.5 grid h-8 w-8 place-items-center rounded-full font-mono text-[13px] text-white backdrop-blur"
            style={{ background: "rgba(11,29,23,.6)" }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 pt-5">
          {product.badge && (
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              <Badge label={product.badge} />
            </div>
          )}
          <h2 className={`${HEADING} text-[32px] leading-[1.1] tracking-tight`}>{product.name}</h2>
          {product.description && (
            <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
              {product.description}
            </p>
          )}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-[24px] font-extrabold tracking-tight" style={{ color: "var(--gold)" }}>
              {formatMenuPrice(product.price, tenant.currency)}
            </span>
            {product.oldPrice != null && (
              <span className="text-[15px] font-semibold line-through" style={{ color: "var(--ink-3)" }}>
                {formatMenuPrice(product.oldPrice, tenant.currency)}
              </span>
            )}
          </div>

          {hasStats && (
            <div className="mt-5 flex gap-2.5">
              <div className="flex-1 rounded-2xl border px-3 py-3.5" style={{ borderColor: "var(--line)", background: "var(--bg)" }}>
                <div className="text-[15px] font-extrabold">{product.kcal} kcal</div>
                <div className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--ink-3)" }}>
                  Enerji
                </div>
              </div>
            </div>
          )}

          {product.dietTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.dietTags.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11.5px] font-semibold"
                  style={{ background: "var(--gold-soft)", border: "1px solid var(--line)", color: "var(--ink-2)" }}
                >
                  {d}
                </span>
              ))}
            </div>
          )}

          {hasIngredients && (
            <div className="mt-6">
              <SmallLabel>İçindekiler</SmallLabel>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--ink-2)" }}>
                {product.ingredients}
              </p>
            </div>
          )}

          {hasAllergens && (
            <div
              className="mt-6 overflow-hidden rounded-2xl border"
              style={{
                borderColor: "color-mix(in srgb, var(--warn) 35%, transparent)",
                background: "color-mix(in srgb, var(--warn) 7%, transparent)",
              }}
            >
              <div
                className="flex items-center gap-2.5 border-b px-4 py-3.5"
                style={{ borderColor: "color-mix(in srgb, var(--warn) 22%, transparent)" }}
              >
                <span
                  className="grid h-[22px] w-[22px] place-items-center rounded-md text-[12px] font-extrabold"
                  style={{ background: "var(--warn)", color: "var(--surface)" }}
                >
                  !
                </span>
                <span className="text-[12.5px] font-extrabold" style={{ color: "var(--warn)" }}>
                  Alerjen bilgisi
                </span>
              </div>
              <div className="px-4 py-4">
                <div className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--ink-3)" }}>
                  İçerir
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.allergens.map((a) => {
                    const meta = ALLERGEN_LABELS[a] ?? { label: a, mark: a.slice(0, 2).toUpperCase() };
                    return (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-lg py-2 pl-2 pr-3 text-[12px] font-bold"
                        style={{ background: "var(--surface)", border: "1px solid color-mix(in srgb, var(--warn) 30%, transparent)" }}
                      >
                        <span
                          className="grid h-5 w-5 place-items-center rounded-md text-[10px] font-extrabold"
                          style={{ background: "color-mix(in srgb, var(--warn) 18%, transparent)", color: "var(--warn)" }}
                        >
                          {meta.mark}
                        </span>
                        {meta.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {minimal && (
            <div className="mt-6 rounded-2xl border border-dashed px-4 py-4" style={{ borderColor: "var(--line)" }}>
              <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--ink-3)" }}>
                Bu ürün için ek bilgi girilmemiş. Detaylar için servis ekibimize sorabilirsiniz.
              </p>
            </div>
          )}
          <div className="h-8" />
        </div>
      </div>
      <div className="border-t px-5 py-5" style={{ borderColor: "var(--line)" }}>
        <PrimaryButton onClick={onClose}>Menüye dön</PrimaryButton>
      </div>
    </div>
  );
}
