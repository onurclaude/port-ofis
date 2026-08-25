import { z } from "zod";

// Mirrors docs/API_CONTRACT.md §7.1 exactly.
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Ad Soyad en az 2 karakter olmalıdır.").max(100, "Ad Soyad en fazla 100 karakter olabilir."),
  phone: z
    .string()
    .trim()
    .min(7, "Telefon numarası en az 7 karakter olmalıdır.")
    .max(20, "Telefon numarası en fazla 20 karakter olabilir.")
    .regex(/^[0-9+() -]+$/, "Geçerli bir telefon numarası giriniz."),
  email: z.string().trim().min(1, "E-posta adresi zorunludur.").max(150, "E-posta en fazla 150 karakter olabilir.").email("Geçerli bir e-posta adresi giriniz."),
  subject: z.string().trim().min(3, "Konu en az 3 karakter olmalıdır.").max(150, "Konu en fazla 150 karakter olabilir."),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalıdır.").max(2000, "Mesaj en fazla 2000 karakter olabilir."),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Kullanıcı adı zorunludur."),
  password: z.string().min(1, "Şifre zorunludur."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug küçük harf, rakam ve tire içermelidir (örn: dijital-baski).");

export const serviceFormSchema = z.object({
  slug: slugSchema.min(2, "Slug en az 2 karakter olmalıdır.").max(120, "Slug en fazla 120 karakter olabilir."),
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalıdır.").max(150, "Ad en fazla 150 karakter olabilir."),
  shortDescription: z.string().trim().min(2, "Kısa açıklama en az 2 karakter olmalıdır.").max(200, "Kısa açıklama en fazla 200 karakter olabilir."),
  description: z.string().trim().min(2, "Açıklama en az 2 karakter olmalıdır."),
  iconKey: z.string().trim().min(2, "İkon anahtarı en az 2 karakter olmalıdır.").max(50, "İkon anahtarı en fazla 50 karakter olabilir."),
  displayOrder: z.coerce.number().int("Tam sayı olmalıdır.").min(0, "0 veya daha büyük olmalıdır."),
  isActive: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export const categoryFormSchema = z.object({
  slug: slugSchema.min(2, "Slug en az 2 karakter olmalıdır.").max(150, "Slug en fazla 150 karakter olabilir."),
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalıdır.").max(150, "Ad en fazla 150 karakter olabilir."),
  description: z.string().trim().max(2000, "Açıklama en fazla 2000 karakter olabilir.").optional().default(""),
  imageUrl: z.string().trim().max(500, "Görsel adresi en fazla 500 karakter olabilir.").optional().default(""),
  displayOrder: z.coerce.number().int("Tam sayı olmalıdır.").min(0, "0 veya daha büyük olmalıdır."),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const productFormSchema = z.object({
  categoryId: z.coerce.number().int("Geçerli bir kategori seçiniz.").positive("Geçerli bir kategori seçiniz."),
  slug: slugSchema.min(2, "Slug en az 2 karakter olmalıdır.").max(150, "Slug en fazla 150 karakter olabilir."),
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalıdır.").max(200, "Ad en fazla 200 karakter olabilir."),
  description: z.string().trim().max(4000, "Açıklama en fazla 4000 karakter olabilir.").optional().default(""),
  imageUrl: z.string().trim().max(500, "Görsel adresi en fazla 500 karakter olabilir.").optional().default(""),
  price: z.union([z.coerce.number().min(0, "0 veya daha büyük olmalıdır."), z.literal("")]).optional(),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "ON_ORDER"]),
  displayOrder: z.coerce.number().int("Tam sayı olmalıdır.").min(0, "0 veya daha büyük olmalıdır."),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const siteSettingsFormSchema = z.object({
  siteName: z.string().trim().min(1, "Site adı zorunludur."),
  phone: z.string().trim().min(1, "Telefon zorunludur."),
  address: z.string().trim().min(1, "Adres zorunludur."),
  websiteUrl: z.string().trim().optional().default(""),
  whatsappNumber: z.string().trim().optional().default(""),
  instagramUrl: z.string().trim().optional().default(""),
  facebookUrl: z.string().trim().optional().default(""),
  workingHours: z.string().trim().optional().default(""),
  mapEmbedUrl: z.string().trim().optional().default(""),
  footerNote: z.string().trim().optional().default(""),
});

export type SiteSettingsFormValues = z.infer<typeof siteSettingsFormSchema>;
