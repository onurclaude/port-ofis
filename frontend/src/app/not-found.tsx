import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-5 text-center">
      <Logo size="lg" />
      <GoldDivider align="center" className="w-16" />
      <div>
        <p className="font-display text-6xl font-semibold text-gold">404</p>
        <p className="mt-3 text-lg text-ivory">Aradığınız sayfa bulunamadı.</p>
      </div>
      <Button asChild>
        <Link href="/">Ana Sayfaya Dön</Link>
      </Button>
    </div>
  );
}
