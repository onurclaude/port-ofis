// Fixed content for the "Dijital Restoran Menüsü" design demo — the
// "Özsoy Bistro" sample menu from cafe-menu's db/seed-demo.sql, with the
// tenant appearance settings (colors, theme mode, visible fields) that
// project's demo tenant uses. A static showcase, not admin-editable.

export type ThemeMode = "dark" | "light";

export interface MenuTenant {
  name: string;
  description: string;
  address: string;
  hoursText: string;
  wifiPassword: string;
  currency: string;
  brandColor: string;
  accentColor: string;
  themeMode: ThemeMode;
  showCalories: boolean;
  showIngredients: boolean;
  showAllergens: boolean;
}

export interface MenuProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice: number | null;
  kcal: number | null;
  ingredients: string;
  allergens: string[];
  dietTags: string[];
  badge: string | null;
  imageUrl: string | null;
}

export interface MenuCategory {
  id: string;
  name: string;
  products: MenuProduct[];
}

export const ALLERGEN_LABELS: Record<string, { label: string; mark: string }> = {
  gluten: { label: "Gluten", mark: "GL" },
  milk: { label: "Süt", mark: "SÜ" },
  egg: { label: "Yumurta", mark: "YU" },
  peanut: { label: "Yer fıstığı", mark: "YF" },
  nuts: { label: "Sert kabuklu", mark: "SK" },
  soy: { label: "Soya", mark: "SO" },
  fish: { label: "Balık", mark: "BA" },
  shell: { label: "Kabuklu deniz", mark: "KD" },
  sesame: { label: "Susam", mark: "SU" },
  mustard: { label: "Hardal", mark: "HA" },
};

export const DIET_TAGS = ["Vejetaryen", "Vegan", "Glutensiz", "Acı"] as const;

export const menuTenant: MenuTenant = {
  name: "Özsoy Bistro",
  description: "Sabahtan gece yarısına, Akdeniz mutfağından ilhamla. Kadıköy, İstanbul.",
  address: "Kadıköy, İstanbul",
  hoursText: "Açık · 23:00'a kadar",
  wifiPassword: "",
  currency: "TL",
  brandColor: "#241f44",
  accentColor: "#e0c05a",
  themeMode: "dark",
  showCalories: true,
  showIngredients: true,
  showAllergens: true,
};

function product(
  id: string,
  name: string,
  description: string,
  price: number,
  extra: Partial<Omit<MenuProduct, "id" | "name" | "description" | "price">> = {}
): MenuProduct {
  return {
    id,
    name,
    description,
    price,
    oldPrice: null,
    kcal: null,
    ingredients: "",
    allergens: [],
    dietTags: [],
    badge: null,
    imageUrl: null,
    ...extra,
  };
}

export const menuCategories: MenuCategory[] = [
  {
    id: "populer",
    name: "Popüler",
    products: [
      product("truflu-menemen", "Trüflü Menemen", "Tereyağı, taze trüf, köy yumurtası, ekşi maya ekmek", 340, {
        badge: "Popüler",
        kcal: 620,
        ingredients: "Köy yumurtası, tereyağı, taze siyah trüf, domates, yeşil biber, ekşi maya ekmek, deniz tuzu.",
        allergens: ["egg", "milk", "gluten"],
        dietTags: ["Vejetaryen"],
      }),
      product("burrata-domates", "Burrata & Domates", "Heirloom domates, fesleğen yağı, deniz tuzu", 390, {
        badge: "Şefin seçimi",
        kcal: 410,
        ingredients: "Burrata peyniri, heirloom domates, fesleğen, sızma zeytinyağı, deniz tuzu, karabiber.",
        allergens: ["milk"],
        dietTags: ["Vejetaryen", "Glutensiz"],
      }),
      product("bistro-burger", "Bistro Burger", "Dry-aged dana, comté, karamelize soğan", 460, {
        badge: "Popüler",
        kcal: 880,
        ingredients: "Dry-aged dana kıyma, comté peyniri, karamelize soğan, brioche ekmek, turşu, hardal aioli.",
        allergens: ["gluten", "milk", "egg", "mustard"],
      }),
    ],
  },
  {
    id: "kahvalti",
    name: "Kahvaltı",
    products: [
      product("fume-somon-tost", "Füme Somon Tost", "Labne, kapari, dereotu, çavdar ekmeği", 420, {
        kcal: 540,
        ingredients: "Norveç füme somonu, labne, kapari, dereotu, çavdar ekmeği, limon.",
        allergens: ["fish", "milk", "gluten"],
      }),
      product("avokado-toast", "Avokado Toast", "Poşe yumurta, acı biber flakes, susam", 310, {
        kcal: 480,
        ingredients: "Avokado, poşe yumurta, ekşi maya ekmek, susam, pul biber, limon.",
        allergens: ["egg", "gluten", "sesame"],
        dietTags: ["Vejetaryen"],
      }),
    ],
  },
  {
    id: "baslangiclar",
    name: "Başlangıçlar",
    products: [
      product("kavrulmus-karnabahar", "Kavrulmuş Karnabahar", "Tahin, nar ekşisi, kişniş", 280, {
        badge: "Vegan",
        kcal: 290,
        ingredients: "Karnabahar, tahin, nar ekşisi, kişniş, zeytinyağı, kimyon.",
        allergens: ["sesame"],
        dietTags: ["Vegan", "Glutensiz"],
      }),
      product("ahtapot-izgara", "Ahtapot Izgara", "Közlenmiş patates, limon, kekik", 520, {
        badge: "Şefin seçimi",
        kcal: 390,
        ingredients: "Ahtapot, patates, limon, kekik, zeytinyağı, defne.",
        allergens: ["shell"],
        dietTags: ["Glutensiz"],
      }),
    ],
  },
  {
    id: "ana-yemekler",
    name: "Ana Yemekler",
    products: [
      product("agir-pismis-kaburga", "Ağır Pişmiş Kaburga", "Kırmızı şarap jus, kereviz püresi", 780, {
        badge: "Şefin seçimi",
        kcal: 940,
        ingredients: "Dana kaburga, kırmızı şarap, kereviz kökü, tereyağı, kekik, sarımsak, havuç.",
        allergens: ["milk"],
      }),
      product("aci-rigatoni", "Acı Rigatoni", "Nduja, domates, pecorino", 410, {
        badge: "Acı",
        kcal: 760,
        ingredients: "Rigatoni, nduja, San Marzano domates, pecorino, sarımsak, pul biber.",
        allergens: ["gluten", "milk"],
        dietTags: ["Acı"],
      }),
    ],
  },
  {
    id: "tatlilar",
    name: "Tatlılar",
    products: [
      product("san-sebastian", "San Sebastián", "Yanık cheesecake, tuzlu karamel", 260, {
        badge: "Popüler",
        kcal: 510,
        ingredients: "Krem peynir, şeker, yumurta, krema, tuzlu karamel.",
        allergens: ["milk", "egg"],
        dietTags: ["Vejetaryen"],
      }),
    ],
  },
  {
    id: "kahve",
    name: "Kahve",
    products: [
      product("flat-white", "Flat White", "Çift shot, tek origin Etiyopya", 145, {
        kcal: 120,
        ingredients: "Espresso, süt.",
        allergens: ["milk"],
        dietTags: ["Vejetaryen", "Glutensiz"],
      }),
      product("turk-kahvesi", "Türk Kahvesi", "Odun ateşinde, lokum eşliğinde", 120, {
        ingredients: "Kahve, su.",
        dietTags: ["Vegan", "Vejetaryen", "Glutensiz"],
      }),
    ],
  },
];

export function formatMenuPrice(price: number, currency: string): string {
  const rounded = Number.isInteger(price) ? price : Math.round(price * 100) / 100;
  return `${rounded.toLocaleString("tr-TR")} ${currency}`;
}
