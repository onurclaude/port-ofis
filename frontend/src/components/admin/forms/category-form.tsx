"use client";

import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/admin/form-field";
import { adminCreateCategory, adminUpdateCategory, ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { categoryFormSchema, type CategoryFormValues } from "@/lib/validation";
import type { AdminCategory } from "@/lib/types";

interface CategoryFormProps {
  initial?: AdminCategory;
  onSuccess: (category: AdminCategory) => void;
  onCancel: () => void;
}

const EMPTY: CategoryFormValues = { slug: "", name: "", description: "", imageUrl: "", displayOrder: 0, isActive: true };

export function CategoryForm({ initial, onSuccess, onCancel }: CategoryFormProps) {
  const { session, logout } = useAdminAuth();
  const [values, setValues] = useState<CategoryFormValues>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof CategoryFormValues>(key: K, value: CategoryFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setFormError(null);

    const parsed = categoryFormSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Partial<Record<keyof CategoryFormValues, string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof CategoryFormValues] = issue.message;
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const result = initial
        ? await adminUpdateCategory(session.token, initial.id, parsed.data)
        : await adminCreateCategory(session.token, parsed.data);
      onSuccess(result);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
          return;
        }
        if (err.fieldErrors.length > 0) {
          const errs: Partial<Record<keyof CategoryFormValues, string>> = {};
          for (const fe of err.fieldErrors) errs[fe.field as keyof CategoryFormValues] = fe.message;
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
      <DialogTitle>{initial ? "Kategoriyi Düzenle" : "Yeni Kategori"}</DialogTitle>

      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="cat-name" label="Ad" error={errors.name}>
            <Input id="cat-name" value={values.name} onChange={(e) => update("name", e.target.value)} invalid={!!errors.name} />
          </FormField>
          <FormField htmlFor="cat-slug" label="Slug" error={errors.slug}>
            <Input
              id="cat-slug"
              value={values.slug}
              onChange={(e) => update("slug", e.target.value)}
              invalid={!!errors.slug}
              placeholder="kirtasiye-urunleri"
            />
          </FormField>
        </div>

        <FormField htmlFor="cat-desc" label="Açıklama" error={errors.description}>
          <Textarea id="cat-desc" value={values.description} onChange={(e) => update("description", e.target.value)} invalid={!!errors.description} />
        </FormField>

        <FormField htmlFor="cat-image" label="Görsel URL" error={errors.imageUrl}>
          <Input
            id="cat-image"
            value={values.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
            invalid={!!errors.imageUrl}
            placeholder="https://..."
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="cat-order" label="Sıra" error={errors.displayOrder}>
            <Input
              id="cat-order"
              type="number"
              min={0}
              value={values.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
              invalid={!!errors.displayOrder}
            />
          </FormField>
          <div className="flex items-end justify-between gap-3 pb-0.5">
            <Label htmlFor="cat-active" className="mb-0">
              Aktif
            </Label>
            <Switch id="cat-active" checked={values.isActive} onCheckedChange={(v) => update("isActive", v)} />
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
