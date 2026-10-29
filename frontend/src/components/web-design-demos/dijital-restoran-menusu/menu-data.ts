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

const IMAGE_BASE = "/web-tasarimlari/dijital-restoran-menusu/yemekler";

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
    imageUrl: `${IMAGE_BASE}/${id}.jpg`,
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

export interface PhotoCredit {
  dish: string;
  author: string;
  license: string;
  url: string;
}

// Wikimedia Commons photos; CC BY / CC BY-SA require attribution (shown in the info sheet).
export const photoCredits: PhotoCredit[] = [
  { dish: "Trüflü Menemen", author: "E4024", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Turkish_egg_dish_Menemen.jpg" },
  { dish: "Burrata & Domates", author: "Gerda Arendt", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Tomato_salad_with_burrata,_Limburg.jpg" },
  { dish: "Bistro Burger", author: "Ceeseven", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Cheeseburger_on_Plate.jpg" },
  { dish: "Füme Somon Tost", author: "Andy Li", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:SMOKED_SALMON_TOAST_-_17_GRAMS_2025-09-20.jpg" },
  { dish: "Avokado Toast", author: "Andy Li", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Smashed_avocado_%26_poached_eggs_-_M%26S_Caf%C3%A9_2023-12-28.jpg" },
  { dish: "Kavrulmuş Karnabahar", author: "Jennifer from Vancouver, Canada", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Vegan_crispy_cauliflower,_tahini_and_pita_bread_(7737974892).jpg" },
  { dish: "Ahtapot Izgara", author: "Daderot", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Grilled_octopus_with_potatoes_and_chorizo_-_Cambridge,_MA.jpg" },
  { dish: "Ağır Pişmiş Kaburga", author: "Paul Lowry", license: "CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Slow_Braised_Short_Rib_NYC.jpg" },
  { dish: "Acı Rigatoni", author: "10Rosso", license: "CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Pasta_alla_matriciana.jpg" },
  { dish: "San Sebastián", author: "さえぼー", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Basque-style_cheesecake_in_Pepito,_Tokyo.jpg" },
  { dish: "Flat White", author: "Tokimemooo", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Flat_White_by_Nijat_Zayidov.jpg" },
  { dish: "Türk Kahvesi", author: "Garrett Ziegler", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Turkish_coffee_in_a_traditional_design_cup.jpg" },
];

export function formatMenuPrice(price: number, currency: string): string {
  const rounded = Number.isInteger(price) ? price : Math.round(price * 100) / 100;
  return `${rounded.toLocaleString("tr-TR")} ${currency}`;
}
