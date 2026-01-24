// Re-export Prisma types
export type {
  Category,
  Gift,
  Contribution,
  PaymentMethod,
  SiteSettings,
} from "@prisma/client";

export {
  GiftType,
  GiftStatus,
  ContributionStatus,
  PaymentMethodType,
  Currency,
} from "@prisma/client";

// Cart types
export interface CartItem {
  giftId: string;
  giftTitle: string;
  giftType: "fundable" | "external" | "custom";
  amount: number; // In cents
  currency: "EUR" | "COP";
  message?: string;
}

export interface CartState {
  items: CartItem[];
  guestName: string;
  guestPhone: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form types
export interface GiftFormData {
  categoryId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  externalUrl?: string;
  type: "fundable" | "external" | "custom";
  targetAmount?: number;
}

export interface ContributionFormData {
  giftId: string;
  guestName: string;
  guestPhone: string;
  guestMessage?: string;
  amount: number;
  currency: "EUR" | "COP";
  paymentMethod: "bizum" | "revolut" | "bancolombia";
}

// Settings form
export interface SettingsFormData {
  guestPassword: string;
  adminPassword: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  heroMessage: string;
  whatsappNumber: string;
}
