"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageOff, PackageSearch, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/data-table";
import { ActiveBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ProductForm } from "@/components/admin/forms/product-form";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { adminDeleteProduct, adminGetCategories, adminGetProducts, ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminQuery } from "@/hooks/use-admin-query";
import type { AdminCategory, AdminProduct, Paginated } from "@/lib/types";

const PAGE_SIZE = 20;

export default function AdminProductsPage() {
  const { session, logout } = useAdminAuth();
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialog, setDialog] = useState<{ mode: "create" } | { mode: "edit"; product: AdminProduct } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);

  useEffect(() => {
    if (!session) return;
    adminGetCategories(session.token)
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [session]);

  const { data: page1, status, setData } = useAdminQuery<Paginated<AdminProduct>>(
    !!session,
    () =>
      adminGetProducts(session!.token, {
        page,
        size: PAGE_SIZE,
        categoryId: categoryFilter === "all" ? undefined : Number(categoryFilter),
      }),
    `${session?.token ?? ""}|${page}|${categoryFilter}|${reloadKey}`,
    () => logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın."),
  );

  function handleSaved(product: AdminProduct) {
    setData((prev) => {
      if (!prev) return prev;
      const exists = prev.content.some((p) => p.id === product.id);
      return {
        ...prev,
        content: exists ? prev.content.map((p) => (p.id === product.id ? product : p)) : [product, ...prev.content],
      };
    });
    setDialog(null);
  }

  async function handleDelete() {
    if (!session || !deleteTarget) return;
    setDeleteError(null);
    try {
      await adminDeleteProduct(session.token, deleteTarget.id);
      setData((prev) => (prev ? { ...prev, content: prev.content.filter((p) => p.id !== deleteTarget.id) } : prev));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
        return;
      }
      setDeleteError(err instanceof ApiError ? err.message : "Ürün silinemedi.");
      throw err;
    }
  }

  const columns: Column<AdminProduct>[] = [
    {
      header: "Görsel",
      cell: (p) => (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-ink-soft">
          {p.imageUrl ? (
            <Image src={p.imageUrl} alt={p.name} fill sizes="40px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageOff className="size-4 text-muted/50" />
            </div>
          )}
        </div>
      ),
    },
    { header: "Ad", cell: (p) => <span className="font-medium text-ivory">{p.name}</span> },
    { header: "Kategori", cell: (p) => <span className="text-muted">{p.category.name}</span> },
    { header: "Fiyat", cell: (p) => formatPrice(p.price) ?? <span className="text-muted">—</span> },
    { header: "Durum", cell: (p) => <ActiveBadge active={p.isActive} /> },
    {
      header: "İşlemler",
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialog({ mode: "edit", product: p })}>
            <Pencil className="size-3.5" /> Düzenle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTarget(p)}
            className="border-red-500/30 text-red-400 hover:border-red-500/60 hover:bg-red-500/5"
          >
            <Trash2 className="size-3.5" /> Sil
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">Ürünler</h1>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" /> Yeni Ekle
        </Button>
      </div>

      <div className="mt-6 max-w-xs">
        <Select
          value={categoryFilter}
          onValueChange={(v) => {
            setCategoryFilter(v);
            setPage(0);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategori filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState variant="block" title="Ürünler yüklenemedi." onRetry={() => setReloadKey((k) => k + 1)} />
        )}
        {status === "success" && page1 && page1.content.length === 0 && (
          <EmptyState
            icon={PackageSearch}
            title="Henüz ürün eklenmemiş."
            action={
              <Button onClick={() => setDialog({ mode: "create" })}>
                <Plus className="size-4" /> Yeni Ekle
              </Button>
            }
          />
        )}
        {status === "success" && page1 && page1.content.length > 0 && (
          <>
            <DataTable columns={columns} rows={page1.content} rowKey={(p) => p.id} />
            <Pagination page={page1.page} totalPages={page1.totalPages} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </div>

      <Dialog open={!!dialog} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="max-w-xl">
          {dialog && (
            <ProductForm
              initial={dialog.mode === "edit" ? dialog.product : undefined}
              categories={categories}
              onSuccess={handleSaved}
              onCancel={() => setDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`"${deleteTarget?.name}" silinsin mi?`}
        description={deleteError ?? "Bu işlem geri alınamaz."}
        onConfirm={handleDelete}
      />
    </div>
  );
}
