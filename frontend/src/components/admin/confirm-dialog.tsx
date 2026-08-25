"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Sil",
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // Caller is expected to surface the failure via `description` and
      // keep the dialog open (e.g. show a conflict message) — nothing
      // further to do here besides not closing.
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription className="mt-3">{description}</DialogDescription>}
        <div className="mt-7 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={loading}>
            Vazgeç
          </Button>
          <Button
            size="sm"
            loading={loading}
            onClick={handleConfirm}
            className="bg-red-500 text-white hover:bg-red-400"
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
