export type Property = {
  id: string;
  sellerId?: number;
  title: string;
  description: string;
  price: number;
  listingType: "SALE" | "RENT";
  type: "HOUSE" | "FLAT" | "PLOT" | "COMMERCIAL";
  subType?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqft: number;
  areaSize?: number | null;
  areaUnit?: "MARLA" | "KANAL" | "SQFT" | null;
  city: string;
  address: string;
  plotNumber?: string | null;
  lat?: number | null;
  lng?: number | null;
  installmentAvailable?: boolean;
  readyForPossession?: boolean;
  amenities?: string[];
  email?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  videoUrl?: string | null;
  images: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export type PropertyListResponse = {
  data: Property[];
  total: number;
  page: number;
};

export type PropertyFilters = {
  q?: string;
  city?: string;
  type?: string;
  listingType?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  page?: string;
};

export type Role = "USER" | "SELLER" | "ADMIN";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type AdminStats = {
  totalListings: number;
  pending: number;
  approved: number;
  rejected: number;
  users: number;
  inquiries: number;
};

export type AdminProperty = Property & {
  sellerName: string;
  sellerEmail: string;
  createdAt: string;
};

export type AdminUser = User & { createdAt: string };

export type AdminInquiry = {
  id: string;
  kind: "INQUIRY" | "VISIT" | "MESSAGE" | "CALLBACK" | "VIEWING";
  message: string;
  createdAt: string;
  propertyId: string | null;
  propertyTitle: string;
  buyerName: string;
  buyerEmail: string;
  phone: string | null;
  visitDate: string | null;
  status: string;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  link?: string | null;
  read: boolean;
  createdAt: string;
};

export type Suggestion = {
  type: "city" | "area" | "property";
  label: string;
  value: string;
  id?: string;
};
