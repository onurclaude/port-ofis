"use client";

import { useState } from "react";
import { DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/admin/form-field";
import { adminCreateProduct, adminUpdateProduct, ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { productFormSchema, type ProductFormValues } from "@/lib/validation";
import type { AdminCategory, AdminProduct, StockStatus } from "@/lib/types";

interface ProductFormProps {
  initial?: AdminProduct;
  categories: AdminCategory[];
  onSuccess: (product: AdminProduct) => void;
  onCancel: () => void;
}

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "IN_STOCK", label: "Stokta" },
  { value: "OUT_OF_STOCK", label: "Stok Dışı" },
  { value: "ON_ORDER", label: "Siparişe Özel" },
];

function toValues(initial?: AdminProduct): ProductFormValues {
  if (!initial) {
    return {
      categoryId: 0,
      slug: "",
      name: "",
      description: "",
      imageUrl: "",
      price: "",
      stockStatus: "IN_STOCK",
      displayOrder: 0,
      isActive: true,
    };
  }
  return {
    categoryId: initial.category.id,
    slug: initial.slug,
    name: initial.name,
    description: initial.description,
    imageUrl: initial.imageUrl,
    price: initial.price ?? "",
    stockStatus: initial.stockStatus,
    displayOrder: initial.displayOrder,
    isActive: initial.isActive,
  };
}

export function ProductForm({ initial, categories, onSuccess, onCancel }: ProductFormProps) {
  const { session, logout } = useAdminAuth();
  const [values, setValues] = useState<ProductFormValues>(toValues(initial));
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setFormError(null);

    const parsed = productFormSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Partial<Record<keyof ProductFormValues, string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof ProductFormValues] = issue.message;
      setErrors(errs);
      return;
    }

    const payload = {
      ...parsed.data,
      price: parsed.data.price === "" || parsed.data.price === undefined ? null : Number(parsed.data.price),
    };

    setLoading(true);
    try {
      const result = initial
        ? await adminUpdateProduct(session.token, initial.id, payload)
        : await adminCreateProduct(session.token, payload);
      onSuccess(result);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
          return;
        }
        if (err.fieldErrors.length > 0) {
          const errs: Partial<Record<keyof ProductFormValues, string>> = {};
          for (const fe of err.fieldErrors) errs[fe.field as keyof ProductFormValues] = fe.message;
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
      <DialogTitle>{initial ? "Ürünü Düzenle" : "Yeni Ürün"}</DialogTitle>

      <div className="mt-6 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="prod-name" label="Ad" error={errors.name}>
            <Input id="prod-name" value={values.name} onChange={(e) => update("name", e.target.value)} invalid={!!errors.name} />
          </FormField>
          <FormField htmlFor="prod-slug" label="Slug" error={errors.slug}>
            <Input id="prod-slug" value={values.slug} onChange={(e) => update("slug", e.target.value)} invalid={!!errors.slug} />
          </FormField>
        </div>

        <FormField htmlFor="prod-category" label="Kategori" error={errors.categoryId}>
          <Select
            value={values.categoryId ? String(values.categoryId) : undefined}
            onValueChange={(v) => update("categoryId", Number(v))}
          >
            <SelectTrigger id="prod-category">
              <SelectValue placeholder="Kategori seçin" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField htmlFor="prod-desc" label="Açıklama" error={errors.description}>
          <Textarea id="prod-desc" value={values.description} onChange={(e) => update("description", e.target.value)} invalid={!!errors.description} />
        </FormField>

        <FormField htmlFor="prod-image" label="Görsel URL" error={errors.imageUrl}>
          <Input id="prod-image" value={values.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} invalid={!!errors.imageUrl} placeholder="https://..." />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField htmlFor="prod-price" label="Fiyat (TL, opsiyonel)" error={errors.price as string | undefined}>
            <Input
              id="prod-price"
              type="number"
              min={0}
              step="0.01"
              value={values.price}
              onChange={(e) => update("price", e.target.value === "" ? "" : Number(e.target.value))}
              invalid={!!errors.price}
            />
          </FormField>
          <FormField htmlFor="prod-stock" label="Stok Durumu" error={errors.stockStatus}>
            <Select value={values.stockStatus} onValueChange={(v) => update("stockStatus", v as StockStatus)}>
              <SelectTrigger id="prod-stock">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STOCK_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField htmlFor="prod-order" label="Sıra" error={errors.displayOrder}>
            <Input
              id="prod-order"
              type="number"
              min={0}
              value={values.displayOrder}
              onChange={(e) => update("displayOrder", Number(e.target.value))}
              invalid={!!errors.displayOrder}
            />
          </FormField>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="prod-active" className="mb-0">
            Aktif
          </Label>
          <Switch id="prod-active" checked={values.isActive} onCheckedChange={(v) => update("isActive", v)} />
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
