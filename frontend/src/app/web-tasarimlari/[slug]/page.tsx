import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WEB_DESIGN_DEMOS } from "@/lib/web-design-demos";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const demo = WEB_DESIGN_DEMOS[slug];
  if (!demo) return {};

  return {
    title: `${demo.title} Örneği`,
    description: `Port Ofis Kırtasiye'nin sunduğu '${demo.title}' paketinin canlı bir örneği.`,
  };
}

export default async function WebDesignDemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = WEB_DESIGN_DEMOS[slug];

  if (!demo) {
    notFound();
  }

  const { title, Component: Demo } = demo;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] flex h-11 items-center justify-center gap-4 border-b border-hairline bg-ink px-4 text-center text-xs text-muted sm:text-sm">
        <span>
          Bu, Port Ofis Kırtasiye&apos;nin sunduğu <span className="text-gold">&quot;{title}&quot;</span> paketinin
          canlı bir örneğidir.
        </span>
        <Link href="/urunler" className="hidden shrink-0 text-gold hover:text-gold-light sm:inline">
          ← Port Ofis Kırtasiye&apos;ye Dön
        </Link>
      </div>
      <Demo />
    </>
  );
}
