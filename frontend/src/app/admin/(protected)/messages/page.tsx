"use client";

import { useState } from "react";
import { Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DataTable, type Column } from "@/components/admin/data-table";
import { MessageStatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { adminDeleteMessage, adminGetMessages, adminUpdateMessageStatus, ApiError } from "@/lib/api";
import { formatDate, cn } from "@/lib/utils";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminQuery } from "@/hooks/use-admin-query";
import type { ContactMessage, Paginated } from "@/lib/types";

const PAGE_SIZE = 20;
const FILTERS = [
  { value: "all", label: "Tümü" },
  { value: "NEW", label: "Yeni" },
  { value: "READ", label: "Okundu" },
] as const;

export default function AdminMessagesPage() {
  const { session, logout } = useAdminAuth();
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<"all" | "NEW" | "READ">("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  const { data: result, status, setData } = useAdminQuery<Paginated<ContactMessage>>(
    !!session,
    () =>
      adminGetMessages(session!.token, {
        page,
        size: PAGE_SIZE,
        status: filter === "all" ? undefined : filter,
      }),
    `${session?.token ?? ""}|${page}|${filter}|${reloadKey}`,
    () => logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın."),
  );

  async function openMessage(message: ContactMessage) {
    setSelected(message);
    if (message.status === "NEW" && session) {
      try {
        const updated = await adminUpdateMessageStatus(session.token, message.id, "READ");
        setSelected(updated);
        setData((prev) =>
          prev ? { ...prev, content: prev.content.map((m) => (m.id === updated.id ? updated : m)) } : prev,
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
        }
        // Non-fatal otherwise: the message still opens, just stays "Yeni".
      }
    }
  }

  async function handleDelete() {
    if (!session || !deleteTarget) return;
    try {
      await adminDeleteMessage(session.token, deleteTarget.id);
      setData((prev) => (prev ? { ...prev, content: prev.content.filter((m) => m.id !== deleteTarget.id) } : prev));
      if (selected?.id === deleteTarget.id) setSelected(null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
        return;
      }
      throw err;
    }
  }

  const columns: Column<ContactMessage>[] = [
    {
      header: "Ad Soyad",
      cell: (m) => (
        <button
          type="button"
          onClick={() => openMessage(m)}
          className={cn("text-left hover:text-gold", m.status === "NEW" ? "font-semibold text-ivory" : "text-ivory/80")}
        >
          {m.status === "NEW" && <span className="mr-2 inline-block size-1.5 rounded-full bg-gold" />}
          {m.name}
        </button>
      ),
    },
    { header: "Konu", cell: (m) => <span className="text-ivory/80">{m.subject}</span> },
    { header: "Tarih", cell: (m) => <span className="text-muted">{formatDate(m.createdAt)}</span> },
    { header: "Durum", cell: (m) => <MessageStatusBadge status={m.status} /> },
    {
      header: "İşlemler",
      cell: (m) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDeleteTarget(m)}
          className="border-red-500/30 text-red-400 hover:border-red-500/60 hover:bg-red-500/5"
        >
          <Trash2 className="size-3.5" /> Sil
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">Mesajlar</h1>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => {
              setFilter(f.value);
              setPage(0);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f.value ? "border-gold bg-gold text-ink" : "border-hairline-soft text-ivory/80 hover:border-gold hover:text-gold",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState variant="block" title="Mesajlar yüklenemedi." onRetry={() => setReloadKey((k) => k + 1)} />
        )}
        {status === "success" && result && result.content.length === 0 && (
          <EmptyState icon={Mail} title="Henüz mesaj yok." />
        )}
        {status === "success" && result && result.content.length > 0 && (
          <>
            <DataTable columns={columns} rows={result.content} rowKey={(m) => m.id} />
            <Pagination page={result.page} totalPages={result.totalPages} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogTitle>{selected.subject}</DialogTitle>
              <p className="mt-1 text-xs text-muted">{formatDate(selected.createdAt)}</p>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Ad Soyad</dt>
                  <dd className="text-ivory">{selected.name}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Telefon</dt>
                  <dd className="text-ivory">
                    <a href={`tel:${selected.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-gold">
                      {selected.phone}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">E-posta</dt>
                  <dd className="text-ivory">
                    <a href={`mailto:${selected.email}`} className="hover:text-gold">
                      {selected.email}
                    </a>
                  </dd>
                </div>
              </dl>
              <p className="mt-5 whitespace-pre-line rounded-sm border border-hairline-soft bg-ink p-4 text-sm leading-relaxed text-ivory/85">
                {selected.message}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`"${deleteTarget?.name}" mesajı silinsin mi?`}
        description="Bu işlem geri alınamaz."
        onConfirm={handleDelete}
      />
    </div>
  );
}
