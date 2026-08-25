export const SITE_NAME = "Port Ofis Kırtasiye";

export const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/baski-merkezi", label: "Baskı Merkezi" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const FALLBACK_ADDRESS = "Eryaman Port AVM, Etimesgut / Ankara";
export const FALLBACK_PHONE = "0312 911 81 02";
export const FALLBACK_WEBSITE = "portofiskirtasiye.com.tr";

/**
 * Static, editorial content for the Baskı Merkezi page.
 * Per FRONTEND_SPEC §4: these are a fixed list of offerings, not admin-managed
 * `products`/`services` rows, to avoid schema over-engineering in this phase.
 */
export const PRINTING_OFFERINGS = [
  {
    title: "Renkli Çıktı",
    description: "Yüksek çözünürlüklü, canlı renkli baskılar — sunum, proje ve kişisel belgeleriniz için.",
  },
  {
    title: "Siyah-Beyaz Çıktı",
    description: "Hızlı ve ekonomik siyah-beyaz doküman baskısı, toplu iş çıktıları için idealdir.",
  },
  {
    title: "Fotokopi",
    description: "Tek sayfadan büyük hacimli işlere kadar hızlı ve kaliteli fotokopi hizmeti.",
  },
  {
    title: "Tarama",
    description: "Belgelerinizi yüksek çözünürlükte dijitalleştirip dilediğiniz formatta teslim ediyoruz.",
  },
  {
    title: "Kupa Baskı",
    description: "Kişiye özel tasarımlarınızı yüksek kaliteli baskı ile kupalara işliyoruz.",
  },
  {
    title: "Fotoğraf Baskı",
    description: "Anılarınızı profesyonel fotoğraf kağıdına, farklı ebat seçenekleriyle bastırın.",
  },
  {
    title: "Kartvizit",
    description: "Kurumsal kimliğinizi yansıtan, özel kesim ve kağıt seçenekli kartvizit baskısı.",
  },
  {
    title: "Broşür",
    description: "Katlamalı ve tek sayfa broşürler, işletmenizi en iyi şekilde tanıtacak kalitede.",
  },
  {
    title: "Etiket",
    description: "Ürün, kutu ve ofis kullanımı için dayanıklı, özel ölçü etiket baskısı.",
  },
  {
    title: "Kaşe",
    description: "Islak ve ofis kaşeleri, aynı gün üretim seçeneğiyle hızlı teslimat.",
  },
  {
    title: "Kişiye Özel Tasarım",
    description: "Davetiyeden ofis malzemesine, ihtiyacınıza özel grafik tasarım ve baskı çözümleri.",
  },
] as const;

/** Static, editorial content for the Kurumsal page. */
export const CORPORATE_OFFERINGS = [
  {
    title: "Kurumsal Kırtasiye Tedariği",
    description:
      "Ofisinizin düzenli kırtasiye ihtiyacını tek kalemde, planlı teslimat ve toplu alım avantajlarıyla karşılıyoruz.",
  },
  {
    title: "Kurumsal Baskı Çözümleri",
    description:
      "Kartvizitten broşüre, rapor ciltlemeden toplu doküman baskısına kadar şirketinizin tüm baskı ihtiyaçları tek adreste.",
  },
  {
    title: "Özel Anlaşmalı Fiyatlandırma",
    description:
      "Düzenli çalıştığımız kurumsal müşterilerimize hacme dayalı, şeffaf ve avantajlı fiyat politikası sunuyoruz.",
  },
  {
    title: "Hızlı Teslimat & Takip",
    description:
      "Eryaman Port AVM merkezli konumumuzdan, bölgenizdeki işletmelere hızlı ve güvenilir teslimat sağlıyoruz.",
  },
] as const;

export const WHY_PORT_OFIS = [
  {
    title: "Tek Noktadan Çözüm",
    description: "Kırtasiyeden dijital baskıya, kurumsal tedarikten kişiye özel ürünlere kadar tüm ihtiyaçlarınız tek adreste.",
  },
  {
    title: "Profesyonel Baskı Kalitesi",
    description: "Modern ekipmanlarımızla renkli/siyah-beyaz baskı, fotokopi ve kişiye özel üretimde tutarlı, yüksek kalite.",
  },
  {
    title: "Kurumsal Güvenilirlik",
    description: "İşletmelerin düzenli tedarik ortağı olarak, zamanında teslimat ve şeffaf iletişimle çalışıyoruz.",
  },
  {
    title: "Eryaman'ın Merkezinde",
    description: "Eryaman Port AVM içindeki konumumuzla Etimesgut ve çevresine kolay ulaşılabilir bir hizmet noktasıyız.",
  },
] as const;

export const SEO_KEYWORDS = [
  "Port Ofis",
  "Eryaman kırtasiye",
  "Eryaman dijital baskı",
  "Etimesgut kırtasiye",
  "Eryaman fotokopi",
  "Eryaman çıktı merkezi",
  "kurumsal kırtasiye",
  "kişiye özel baskı",
];
