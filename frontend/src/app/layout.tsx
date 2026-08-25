import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Pinyon_Script } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script-accent",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://portofiskirtasiye.com.tr"),
  title: {
    default: "Port Ofis Kırtasiye | Eryaman Kırtasiye ve Dijital Baskı Merkezi",
    template: "%s | Port Ofis Kırtasiye",
  },
  description:
    "Port Ofis Kırtasiye — Eryaman Port AVM içinde kırtasiye, dijital baskı, fotokopi, kurumsal ofis çözümleri ve kişiye özel ürünler tek noktada.",
  keywords: [
    "Port Ofis",
    "Eryaman kırtasiye",
    "Eryaman dijital baskı",
    "Etimesgut kırtasiye",
    "Eryaman fotokopi",
    "Eryaman çıktı merkezi",
  ],
  authors: [{ name: "Port Ofis Kırtasiye" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Port Ofis Kırtasiye",
    title: "Port Ofis Kırtasiye | Eryaman Kırtasiye ve Dijital Baskı Merkezi",
    description:
      "Kırtasiye, dijital baskı, kurumsal çözümler ve kişiye özel ürünler tek noktada — Eryaman Port AVM.",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${cormorant.variable} ${pinyonScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-text">
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#151515",
              color: "#F5F5F5",
              border: "1px solid rgba(201,162,74,0.3)",
            },
          }}
        />
      </body>
    </html>
  );
}
