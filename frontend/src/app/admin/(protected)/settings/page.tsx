"use client";

import { useState } from "react";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { adminGetSiteSettings } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { useAdminQuery } from "@/hooks/use-admin-query";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const { session, logout } = useAdminAuth();
  const [reloadKey, setReloadKey] = useState(0);

  const { data: settings, status } = useAdminQuery<SiteSettings>(
    !!session,
    () => adminGetSiteSettings(session!.token),
    `${session?.token ?? ""}|${reloadKey}`,
    () => logout("Oturumunuz sona erdi, lütfen tekrar giriş yapın."),
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ivory sm:text-3xl">Site Ayarları</h1>
      <p className="mt-2 text-sm text-muted">
        Bu bilgiler sitenin genelinde (üst bilgi, alt bilgi, iletişim sayfası) kullanılır.
      </p>

      <div className="mt-8">
        {status === "loading" && <LoadingState />}
        {status === "error" && (
          <ErrorState variant="block" title="Ayarlar yüklenemedi." onRetry={() => setReloadKey((k) => k + 1)} />
        )}
        {status === "success" && settings && <SettingsForm initial={settings} />}
      </div>
    </div>
  );
}
