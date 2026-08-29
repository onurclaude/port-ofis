// Fixed content for the "Standart Web Sitesi" design demo — adapted from
// company-template's clients/port-ofis/company.json. This is a static
// showcase (not admin-editable), so the shape is hardcoded rather than
// loaded through a schema/config-loader layer.

export interface DemoServiceItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  featured: boolean;
}

export interface DemoGalleryItem {
  src: string;
  alt: string;
  caption: string;
}

export interface DemoConfig {
  meta: {
    companyName: string;
    tagline: string;
    sector: string;
    description: string;
  };
  services: DemoServiceItem[];
  contact: {
    phone: string;
    whatsapp: string | null;
    email: string | null;
    address: {
      line1: string;
      district: string | null;
      city: string;
      country: string;
    };
    mapUrl: string | null;
    workingHours: string | null;
  };
  social: Record<string, string | undefined>;
  images: {
    logo: string;
    heroSideLogo: string | null;
    hero: string;
    gallery: DemoGalleryItem[];
  };
  stats: { value: string; label: string }[];
}

export const demoConfig: DemoConfig = {
  meta: {
    companyName: "Port Ofis",
    tagline: "Fikirden kişiye özel ürüne",
    sector: "Kırtasiye, Dijital Baskı, Promosyon ve Kişiye Özel Ürünler",
    description:
      "Port Ofis; kırtasiye, dijital baskı, kupa baskı, kaşe, oyuncak ve promosyon ürünlerinde kişiye özel çözümler sunan, Ankara Eryaman Port AVM merkezli bir mağazadır.",
  },
  services: [
    {
      id: "dijital-baski",
      title: "Dijital Baskı",
      description: "Kartvizitten broşüre, afişten etikete; yüksek çözünürlüklü dijital baskı çözümleri.",
      image: "dijital-baski.jpg",
      featured: true,
    },
    {
      id: "kupa-baski",
      title: "Kupa Baskı",
      description: "Kişiye özel tasarımların kupa üzerine canlı ve kalıcı baskısı.",
      image: "kupa-baski.jpg",
      featured: true,
    },
    {
      id: "kase",
      title: "Kaşe",
      description: "Kurumsal ve bireysel kullanım için özel tasarım kaşe üretimi.",
      image: "kase.jpg",
      featured: false,
    },
    {
      id: "kirtasiye",
      title: "Kırtasiye",
      description: "Ofis ve okul ihtiyaçları için geniş kırtasiye ürün yelpazesi.",
      image: "kirtasiye.jpg",
      featured: true,
    },
    {
      id: "oyuncak",
      title: "Oyuncak",
      description: "Çocuklar için özenle seçilmiş oyuncak ve hediyelik ürünler.",
      image: "oyuncak.jpg",
      featured: false,
    },
    {
      id: "promosyon-urunleri",
      title: "Promosyon Ürünleri",
      description: "Kurumsal etkinlik ve tanıtımlar için özel promosyon ürünleri.",
      image: "promosyon-urunleri.jpg",
      featured: true,
    },
    {
      id: "kisiye-ozel-urunler",
      title: "Kişiye Özel Ürünler",
      description: "Fikrinizi, tasarımdan üretime, size özel bir ürüne dönüştürüyoruz.",
      image: "kisiye-ozel-urunler.jpg",
      featured: true,
    },
  ],
  contact: {
    phone: "0312 911 81 02",
    whatsapp: null,
    email: null,
    address: {
      line1: "Eryaman Port AVM",
      district: "Eryaman",
      city: "Ankara",
      country: "Türkiye",
    },
    mapUrl: null,
    workingHours: null,
  },
  social: {},
  images: {
    logo: "logo.png",
    heroSideLogo: "logo.png",
    hero: "hero.jpg",
    gallery: [
      { src: "dijital-baski.jpg", alt: "Dijital baskı çalışması", caption: "Dijital Baskı Örnekleri" },
      { src: "kupa-baski.jpg", alt: "Kişiye özel baskılı kupa", caption: "Kupa Baskı Örnekleri" },
      { src: "kirtasiye.jpg", alt: "Kırtasiye ürün rafı", caption: "Kırtasiye Örnekleri" },
      { src: "promosyon-urunleri.jpg", alt: "Promosyon ürünleri", caption: "Promosyon Ürünleri" },
      { src: "kisiye-ozel-urunler.jpg", alt: "Lazer gravür ile kişiye özel ürün", caption: "Kişiye Özel Ürünler" },
    ],
  },
  stats: [],
};
