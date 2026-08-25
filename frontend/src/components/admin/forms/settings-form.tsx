"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/admin/form-field";
import { adminUpdateSiteSettings, ApiError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { siteSettingsFormSchema, type SiteSettingsFormValues } from "@/lib/validation";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const { session, logout } = useAdminAuth();
  const [values, setValues] = useState<SiteSettingsFormValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof SiteSettingsFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof SiteSettingsFormValues>(key: K, value: SiteSettingsFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setSavedAt(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setFormError(null);

    const parsed = siteSettingsFormSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Partial<Record<keyof SiteSettingsFormValues, string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof SiteSettingsFormValues] = issue.message;
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const result = await adminUpdateSiteSettings(session.token, parsed.data);
      setValues(result);
      setSavedAt(Date.now());
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın.");
          return;
        }
        if (err.fieldErrors.length > 0) {
          const errs: Partial<Record<keyof SiteSettingsFormValues, string>> = {};
          for (const fe of err.fieldErrors) errs[fe.field as keyof SiteSettingsFormValues] = fe.message;
          setErrors(errs);
        }
        setFormError(err.message);
      } else {
        setFormError("Ayarlar kaydedilemedi, lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField htmlFor="set-siteName" label="Site Adı" error={errors.siteName}>
          <Input id="set-siteName" value={values.siteName} onChange={(e) => update("siteName", e.target.value)} invalid={!!errors.siteName} />
        </FormField>
        <FormField htmlFor="set-phone" label="Telefon" error={errors.phone}>
          <Input id="set-phone" value={values.phone} onChange={(e) => update("phone", e.target.value)} invalid={!!errors.phone} />
        </FormField>
      </div>

      <FormField htmlFor="set-address" label="Adres" error={errors.address}>
        <Textarea id="set-address" value={values.address} onChange={(e) => update("address", e.target.value)} invalid={!!errors.address} />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField htmlFor="set-website" label="Web Sitesi URL" error={errors.websiteUrl}>
          <Input id="set-website" value={values.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} invalid={!!errors.websiteUrl} />
        </FormField>
        <FormField htmlFor="set-whatsapp" label="WhatsApp Numarası" error={errors.whatsappNumber}>
          <Input id="set-whatsapp" value={values.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} invalid={!!errors.whatsappNumber} />
        </FormField>
        <FormField htmlFor="set-instagram" label="Instagram URL" error={errors.instagramUrl}>
          <Input id="set-instagram" value={values.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)} invalid={!!errors.instagramUrl} />
        </FormField>
        <FormField htmlFor="set-facebook" label="Facebook URL" error={errors.facebookUrl}>
          <Input id="set-facebook" value={values.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)} invalid={!!errors.facebookUrl} />
        </FormField>
        <FormField htmlFor="set-hours" label="Çalışma Saatleri" error={errors.workingHours}>
          <Input id="set-hours" value={values.workingHours} onChange={(e) => update("workingHours", e.target.value)} invalid={!!errors.workingHours} />
        </FormField>
        <FormField htmlFor="set-map" label="Harita Embed URL" error={errors.mapEmbedUrl}>
          <Input id="set-map" value={values.mapEmbedUrl} onChange={(e) => update("mapEmbedUrl", e.target.value)} invalid={!!errors.mapEmbedUrl} />
        </FormField>
      </div>

      <FormField htmlFor="set-footer" label="Footer Notu" error={errors.footerNote}>
        <Textarea id="set-footer" value={values.footerNote} onChange={(e) => update("footerNote", e.target.value)} invalid={!!errors.footerNote} />
      </FormField>

      {formError && (
        <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {formError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" loading={loading}>
          Kaydet
        </Button>
        {savedAt && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <CheckCircle2 className="size-4" /> Ayarlar kaydedildi.
          </span>
        )}
      </div>
    </form>
  );
}
