"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoldDivider } from "@/components/brand/gold-divider";
import { adminLogin, ApiError, ApiNetworkError } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth";
import { loginSchema } from "@/lib/validation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const infoMessage = searchParams.get("message");
  const { login } = useAdminAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      const res = await adminLogin(parsed.data);
      login(res);
      router.replace("/admin");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Kullanıcı adı veya şifre hatalı.");
      } else if (err instanceof ApiNetworkError) {
        setError("Sunucuya ulaşılamıyor. Lütfen tekrar deneyin.");
      } else {
        setError("Giriş yapılamadı, lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        <GoldDivider align="center" className="mx-auto mt-6 w-16" />
        <h1 className="mt-6 text-center font-display text-2xl font-semibold text-ivory">Yönetim Paneli</h1>

        {infoMessage && (
          <p className="mt-6 rounded-sm border border-gold/30 bg-gold/5 px-4 py-3 text-center text-sm text-gold">
            {infoMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          <div>
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              invalid={!!error}
            />
          </div>
          <div>
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              invalid={!!error}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-sm border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" loading={loading} className="w-full">
            Giriş Yap
          </Button>
        </form>
      </div>
    </div>
  );
}
