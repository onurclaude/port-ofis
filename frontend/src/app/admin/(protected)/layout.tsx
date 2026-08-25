"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LoadingState } from "@/components/shared/loading-state";
import { useAdminAuth } from "@/lib/admin-auth";

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { session, isReady } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !session) {
      router.replace("/admin/login");
    }
  }, [isReady, session, router]);

  if (!isReady || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingState label="Oturum kontrol ediliyor..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden px-5 py-8 sm:px-8 sm:py-10">{children}</main>
    </div>
  );
}
