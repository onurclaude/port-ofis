import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Giriş Yap" };

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
