import type { Metadata } from "next";
import { AdminAuthProvider } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: {
    default: "Yönetim Paneli",
    template: "%s | Port Ofis Yönetim",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink">
      <AdminAuthProvider>{children}</AdminAuthProvider>
    </div>
  );
}
