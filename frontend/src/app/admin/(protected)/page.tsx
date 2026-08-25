"use client";

import Link from "next/link";
import { LayoutGrid, Mail, PackageSearch, Sparkles } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { adminGetCategories, adminGetMessages, adminGetProducts, adminGetServices } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminQuery } from "@/hooks/use-admin-query";

interface Counts {
  services: number;
  categories: number;
  products: number;
  newMessages: number;
}

export default function AdminDashboardPage() {
  const { session, logout } = useAdminAuth();

  const { data: counts, status } = useAdminQuery<Counts>(
    !!session,
    async () => {
      const token = session!.token;
      const [services, categories, products, messages] = await Promise.all([
        adminGetServices(token),
        adminGetCategories(token),
        adminGetProducts(token, { size: 1 }),
        adminGetMessages(token, { status: "NEW", size: 1 }),
      ]);
      return {
        services: services.length,
        categories: categories.length,
        products: products.totalElements,
        newMessages: messages.totalElements,
      };
    },
    session?.token ?? "",
    () => logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın."),
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">Yönetim Paneli</h1>
      <p className="mt-2 text-sm text-muted">Hoş geldiniz{session ? `, ${session.username}` : ""}.</p>

      {status === "loading" && (
        <div className="mt-10">
          <LoadingState />
        </div>
      )}

      {status === "error" && (
        <div className="mt-10">
          <ErrorState variant="banner" title="Panel verileri yüklenemedi." />
        </div>
      )}

      {status === "success" && counts && (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Sparkles} label="Hizmetler" value={counts.services} href="/admin/services" />
          <StatCard icon={LayoutGrid} label="Kategoriler" value={counts.categories} href="/admin/categories" />
          <StatCard icon={PackageSearch} label="Ürünler" value={counts.products} href="/admin/products" />
          <StatCard icon={Mail} label="Yeni Mesajlar" value={counts.newMessages} href="/admin/messages" />
        </div>
      )}

      <div className="mt-12 rounded-sm border border-hairline-soft bg-ink-soft p-6">
        <h2 className="font-display text-lg font-medium text-ivory">Hızlı Erişim</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/services" className="text-sm text-gold hover:text-gold-light">
            Hizmetleri Yönet →
          </Link>
          <span className="text-hairline">·</span>
          <Link href="/admin/categories" className="text-sm text-gold hover:text-gold-light">
            Kategorileri Yönet →
          </Link>
          <span className="text-hairline">·</span>
          <Link href="/admin/products" className="text-sm text-gold hover:text-gold-light">
            Ürünleri Yönet →
          </Link>
          <span className="text-hairline">·</span>
          <Link href="/admin/settings" className="text-sm text-gold hover:text-gold-light">
            Site Ayarları →
          </Link>
        </div>
      </div>
    </div>
  );
}
