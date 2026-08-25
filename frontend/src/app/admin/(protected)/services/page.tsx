"use client";

import { useState } from "react";
import { Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { ActiveBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { ServiceForm } from "@/components/admin/forms/service-form";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { adminDeleteService, adminGetServices, ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminQuery } from "@/hooks/use-admin-query";
import type { AdminService } from "@/lib/types";

export default function AdminServicesPage() {
  const { session, logout } = useAdminAuth();
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<{ mode: "create" } | { mode: "edit"; service: AdminService } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminService | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: services, status, setData } = useAdminQuery<AdminService[]>(
    !!session,
    () => adminGetServices(session!.token),
    `${session?.token ?? ""}|${reloadKey}`,
    () => logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın."),
  );

  function handleSaved(service: AdminService) {
    setData((prev) => {
      if (!prev) return [service];
      const exists = prev.some((s) => s.id === service.id);
      return exists ? prev.map((s) => (s.id === service.id ? service : s)) : [...prev, service];
    });
    setDialog(null);
  }

  async function handleDelete() {
    if (!session || !deleteTarget) return;
    setDeleteError(null);
    try {
      await adminDeleteService(session.token, deleteTarget.id);
      setData((prev) => prev?.filter((s) => s.id !== deleteTarget.id) ?? null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
        return;
      }
      setDeleteError(err instanceof ApiError ? err.message : "Hizmet silinemedi.");
      throw err;
    }
  }

  const columns: Column<AdminService>[] = [
    { header: "Ad", cell: (s) => <span className="font-medium text-ivory">{s.name}</span> },
    { header: "Slug", cell: (s) => <span className="text-muted">{s.slug}</span> },
    { header: "Sıra", cell: (s) => s.displayOrder },
    { header: "Durum", cell: (s) => <ActiveBadge active={s.isActive} /> },
    {
      header: "İşlemler",
      cell: (s) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setDialog({ mode: "edit", service: s })}>
            <Pencil className="size-3.5" /> Düzenle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteTarget(s)}
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
        <h1 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">Hizmetler</h1>
        <Button onClick={() => setDialog({ mode: "create" })}>
          <Plus className="size-4" /> Yeni Ekle
        </Button>
      </div>

      <div className="mt-8">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState variant="block" title="Hizmetler yüklenemedi." onRetry={() => setReloadKey((k) => k + 1)} />
        )}
        {status === "success" && services && services.length === 0 && (
          <EmptyState
            icon={Sparkles}
            title="Henüz hizmet eklenmemiş."
            action={
              <Button onClick={() => setDialog({ mode: "create" })}>
                <Plus className="size-4" /> Yeni Ekle
              </Button>
            }
          />
        )}
        {status === "success" && services && services.length > 0 && (
          <DataTable columns={columns} rows={services} rowKey={(s) => s.id} />
        )}
      </div>

      <Dialog open={!!dialog} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="max-w-xl">
          {dialog && (
            <ServiceForm
              initial={dialog.mode === "edit" ? dialog.service : undefined}
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
