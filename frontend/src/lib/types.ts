// Types mirroring docs/API_CONTRACT.md exactly. Field names are camelCase to match the JSON wire format.

export interface Service {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  iconKey: string;
  displayOrder: number;
}

export interface AdminService extends Service {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
}

export interface AdminCategory extends Category {
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK" | "ON_ORDER";

export interface ProductCategoryRef {
  id: number;
  slug: string;
  name: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number | null;
  stockStatus: StockStatus;
  category: ProductCategoryRef;
}

export interface AdminProduct extends Product {
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SiteSettings {
  siteName: string;
  phone: string;
  address: string;
  websiteUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  workingHours: string;
  mapEmbedUrl: string;
  footerNote: string;
}

export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactRequest {
  id: number;
  status: "NEW" | "READ";
  createdAt: string;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  code: string;
  message: string;
  fieldErrors: ApiFieldError[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  username: string;
}

export interface ServiceWriteRequest {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  iconKey: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CategoryWriteRequest {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProductWriteRequest {
  categoryId: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number | null;
  stockStatus: StockStatus;
  displayOrder: number;
  isActive: boolean;
}
