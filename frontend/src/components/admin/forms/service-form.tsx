"use client";

import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/admin/form-field";
import { adminCreateService, adminUpdateService, ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { serviceFormSchema, type ServiceFormValues } from "@/lib/validation";
import type { AdminService } from "@/lib/types";

interface ServiceFormProps {
  initial?: AdminService;
  onSuccess: (service: AdminService) => void;
  onCancel: () => void;
}

const EMPTY: ServiceFormValues = {
  slug: "",
  name: "",
  shortDescription: "",
  description: "",
  iconKey: "printer",
  displayOrder: 0,
  isActive: true,
};

export function ServiceForm({ initial, onSuccess, onCancel }: ServiceFormProps) {
  const { session, logout } = useAdminAuth();
  const [values, setValues] = useState<ServiceFormValues>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof ServiceFormValues>(key: K, value: ServiceFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setFormError(null);

    const parsed = serviceFormSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Partial<Record<keyof ServiceFormValues, string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof ServiceFormValues] = issue.message;
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const result = initial
        ? await adminUpdateService(session.token, initial.id, parsed.data)
        : await adminCreateService(session.token, parsed.data);
      onSuccess(result);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
          return;
        }
        if (err.fieldErrors.length > 0) {
          const errs: Partial<Record<keyof ServiceFormValues, string>> = {};
          for (const fe of err.fieldErrors) errs[fe.field as keyof ServiceFormValues] = fe.message;
          setErrors(errs);
        }
        setFormError(err.message);
      } else {
        setFormError("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <DialogTitle>{initial ? "Hizmeti Düzenle" : "Yeni Hizmet"}</DialogTitle>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="svc-name" label="Ad" error={errors.name}>
            <Input id="svc-name" value={values.name} onChange={(e) => update("name", e.target.value)} invalid={!!errors.name} />
          </FormField>
          <FormField htmlFor="svc-slug" label="Slug" error={errors.slug}>
            <Input
              id="svc-slug"
              value={values.slug}
              onChange={(e) => update("slug", e.target.value)}
              invalid={!!errors.slug}
              placeholder="dijital-baski"
            />
          </FormField>
        </div>

        <FormField htmlFor="svc-short" label="Kısa Açıklama" error={errors.shortDescription}>
          <Input
            id="svc-short"
            value={values.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            invalid={!!errors.shortDescription}
            maxLength={200}
          />
        </FormField>

        <FormField htmlFor="svc-desc" label="Açıklama" error={errors.description}>
          <Textarea
            id="svc-desc"
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            invalid={!!errors.description}
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField htmlFor="svc-icon" label="İkon Anahtarı" error={errors.iconKey}>
            <Input id="svc-icon" value={values.iconKey} onChange={(e) => update("iconKey", e.target.value)} invalid={!!errors.iconKey} />
          </FormField>
          <FormField htmlFor="svc-order" label="Sıra" error={errors.displayOrder}>
            <Input
              id="svc-order"
              type="number"
              min={0}
              value={values.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
              invalid={!!errors.displayOrder}
            />
          </FormField>
          <div className="flex items-end justify-between gap-3 pb-0.5">
            <Label htmlFor="svc-active" className="mb-0">
              Aktif
            </Label>
            <Switch id="svc-active" checked={values.isActive} onCheckedChange={(v) => update("isActive", v)} />
          </div>
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-5 rounded-sm border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {formError}
        </p>
      )}

      <div className="mt-7 flex justify-end gap-3">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={loading}>
          Vazgeç
        </Button>
        <Button type="submit" size="sm" loading={loading}>
          Kaydet
        </Button>
      </div>
    </form>
  );
}
