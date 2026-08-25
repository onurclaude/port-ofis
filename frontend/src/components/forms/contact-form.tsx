"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, ApiNetworkError, postContact } from "@/lib/api";
import { contactSchema, type ContactFormValues } from "@/lib/validation";

const EMPTY_FORM: ContactFormValues = { name: "", phone: "", email: "", subject: "", message: "" };

const SUCCESS_MESSAGE = "Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.";

export function ContactForm({ initialSubject = "" }: { initialSubject?: string }) {
  const [values, setValues] = useState<ContactFormValues>({ ...EMPTY_FORM, subject: initialSubject });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);

  function updateField<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const errs: Partial<Record<keyof ContactFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactFormValues;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setStatus("loading");
    setFieldErrors({});
    try {
      await postContact(parsed.data);
      setStatus("success");
      setValues(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError && err.code === "VALIDATION_ERROR") {
        const errs: Partial<Record<keyof ContactFormValues, string>> = {};
        for (const fe of err.fieldErrors) {
          errs[fe.field as keyof ContactFormValues] = fe.message;
        }
        setFieldErrors(errs);
        setFormError(err.message);
      } else if (err instanceof ApiNetworkError) {
        setFormError("Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
      } else {
        setFormError("Mesajınız gönderilemedi. Lütfen daha sonra tekrar deneyin.");
      }
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-4 rounded-sm border border-gold/30 bg-gold/5 px-6 py-14 text-center"
      >
        <CheckCircle2 className="size-10 text-gold" aria-hidden="true" />
        <p className="font-display text-xl text-ivory">{SUCCESS_MESSAGE}</p>
        <Button variant="outline" size="sm" onClick={() => setStatus("idle")}>
          Yeni Mesaj Gönder
        </Button>
      </div>
    );
  }

  const loading = status === "loading";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Ad Soyad</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            invalid={!!fieldErrors.name}
            disabled={loading}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="name-error" className="mt-1.5 text-xs text-red-400">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            invalid={!!fieldErrors.phone}
            disabled={loading}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
          />
          {fieldErrors.phone && (
            <p id="phone-error" className="mt-1.5 text-xs text-red-400">
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email">E-posta</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => updateField("email", e.target.value)}
          invalid={!!fieldErrors.email}
          disabled={loading}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-red-400">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="subject">Konu</Label>
        <Input
          id="subject"
          name="subject"
          value={values.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          invalid={!!fieldErrors.subject}
          disabled={loading}
          aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
        />
        {fieldErrors.subject && (
          <p id="subject-error" className="mt-1.5 text-xs text-red-400">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Mesaj</Label>
        <Textarea
          id="message"
          name="message"
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          invalid={!!fieldErrors.message}
          disabled={loading}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {fieldErrors.message && (
          <p id="message-error" className="mt-1.5 text-xs text-red-400">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {formError && (
        <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          {formError}
        </p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
        {loading ? "Gönderiliyor..." : "Gönder"}
      </Button>
    </form>
  );
}
