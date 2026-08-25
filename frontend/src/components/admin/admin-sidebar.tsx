"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Mail,
  Menu,
  PackageSearch,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useAdminAuth } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/services", label: "Hizmetler", icon: Sparkles },
  { href: "/admin/categories", label: "Kategoriler", icon: LayoutGrid },
  { href: "/admin/products", label: "Ürünler", icon: PackageSearch },
  { href: "/admin/messages", label: "Mesajlar", icon: Mail },
  { href: "/admin/settings", label: "Site Ayarları", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { session, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const content = (
    <>
      <div className="flex items-center justify-between px-5 py-6">
        <Link href="/admin">
          <Logo size="sm" />
        </Link>
        <button
          type="button"
          className="text-muted hover:text-gold lg:hidden"
          aria-label="Menüyü kapat"
          onClick={() => setMobileOpen(false)}
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Yönetim menüsü">
        {LINKS.map((link) => {
          const isActive = "exact" in link && link.exact ? pathname === link.href : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-gold/10 text-gold" : "text-ivory/75 hover:bg-surface hover:text-ivory",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-4" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline-soft px-5 py-5">
        {session && <p className="mb-3 truncate text-xs text-muted">Giriş: {session.username}</p>}
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-2.5 rounded-sm border border-hairline-soft px-3 py-2.5 text-sm text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Çıkış Yap
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-hairline-soft bg-ink-soft px-5 py-4 lg:hidden">
        <Logo size="sm" />
        <button
          type="button"
          aria-label="Menüyü aç"
          onClick={() => setMobileOpen(true)}
          className="text-ivory"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-ink/80"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-72 flex-col bg-ink-soft">{content}</aside>
        </div>
      )}

      <aside className="hidden w-64 shrink-0 flex-col border-r border-hairline-soft bg-ink-soft lg:flex">
        {content}
      </aside>
    </>
  );
}
