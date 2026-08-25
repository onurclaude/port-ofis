"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff, LayoutGrid, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { ActiveBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { CategoryForm } from "@/components/admin/forms/category-form";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { adminDeleteCategory, adminGetCategories, ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminQuery } from "@/hooks/use-admin-query";
import type { AdminCategory } from "@/lib/types";

export default function AdminCategoriesPage() {
  const { session, logout } = useAdminAuth();
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<{ mode: "create" } | { mode: "edit"; category: AdminCategory } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: categories, status, setData } = useAdminQuery<AdminCategory[]>(
    !!session,
    () => adminGetCategories(session!.token),
    `${session?.token ?? ""}|${reloadKey}`,
    () => logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın."),
  );

  function handleSaved(category: AdminCategory) {
    setData((prev) => {
      if (!prev) return [category];
      const exists = prev.some((c) => c.id === category.id);
      return exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
    });
    setDialog(null);
  }

  async function handleDelete() {
    if (!session || !deleteTarget) return;
    setDeleteError(null);
    try {
      await adminDeleteCategory(session.token, deleteTarget.id);
      setData((prev) => prev?.filter((c) => c.id !== deleteTarget.id) ?? null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
        return;
      }
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Kategori silinemedi.",
      );
      throw err;
    }
  }

  const columns: Column<AdminCategory>[] = [
    {
      header: "Görsel",
      cell: (c) => (
        <div className="relative size-10 shrink-0 overflow-hidden rounded-sm bg-ink-soft">
          {c.imageUrl ? (
            <Image src={c.imageUrl} alt={c.name} fill sizes="40px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageOff className="size-4 text-muted/50" />
            </div>
          )}
        </div>
      ),
    },
    { header: "Ad", cell: (c) => <span className="font-medium text-ivory">{c.name}</span> },
    { header: "Slug", cell: (c) => <span className="text-muted">{c.slug}</span> },
    { header: "Sıra", cell: (c) => c.displayOrder },
    { header: "Durum", cell: (c) => <ActiveBadge active={c.isActive} /> },
    {
      header: "İşlemler",
      cell: (c) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialog({ mode: "edit", category: c })}>
            <Pencil className="size-3.5" /> Düzenle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTarget(c)}
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
        <h1 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">Kategoriler</h1>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" /> Yeni Ekle
        </Button>
      </div>

      <div className="mt-8">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState variant="block" title="Kategoriler yüklenemedi." onRetry={() => setReloadKey((k) => k + 1)} />
        )}
        {status === "success" && categories && categories.length === 0 && (
          <EmptyState
            icon={LayoutGrid}
            title="Henüz kategori eklenmemiş."
            action={
              <Button onClick={() => setDialog({ mode: "create" })}>
                <Plus className="size-4" /> Yeni Ekle
              </Button>
            }
          />
        )}
        {status === "success" && categories && categories.length > 0 && (
          <DataTable columns={columns} rows={categories} rowKey={(c) => c.id} />
        )}
      </div>

      <Dialog open={!!dialog} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="max-w-xl">
          {dialog && (
            <CategoryForm
              initial={dialog.mode === "edit" ? dialog.category : undefined}
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
