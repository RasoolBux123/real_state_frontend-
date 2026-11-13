import { http } from "./http";
import { API_URL } from "./config";
import type { Property, PropertyFilters, PropertyListResponse } from "../types";

export type ApiProperty = {
  id: number | string;
  seller_id?: number;
  title: string;
  description?: string | null;
  city: string;
  location?: string;
  address?: string | null;
  property_type: string;
  listing_type: string;
  price: number | string;
  area: number | string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sub_type?: string | null;
  area_size?: number | string | null;
  area_unit?: "MARLA" | "KANAL" | "SQFT" | null;
  installment_available?: boolean | null;
  ready_for_possession?: boolean | null;
  amenities?: string[] | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  whatsapp?: string | null;
  video_url?: string | null;
  images?: string[] | null;
  status: string;
  created_at?: string;
};

export function imageUrl(path: string) {
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}

export function normalizeType(value: string): Property["type"] {
  const t = value.toLowerCase();
  if (t === "apartment" || t === "flat") return "FLAT";
  if (t === "plot") return "PLOT";
  if (t === "commercial") return "COMMERCIAL";
  return "HOUSE";
}

export function normalizeProperty(raw: ApiProperty): Property {
  const status = raw.status.toUpperCase();
  return {
    id: String(raw.id),
    sellerId: raw.seller_id,
    title: raw.title,
    description: raw.description ?? "",
    price: Number(raw.price),
    listingType: raw.listing_type.toUpperCase() === "RENT" ? "RENT" : "SALE",
    type: normalizeType(raw.property_type),
    bedrooms: raw.bedrooms ?? null,
    bathrooms: raw.bathrooms ?? null,
    subType: raw.sub_type ?? null,
    areaSqft: Number(raw.area),
    areaSize: raw.area_size == null ? null : Number(raw.area_size),
    areaUnit: raw.area_unit ?? null,
    city: raw.city,
    address: raw.location ?? raw.address ?? raw.city,
    installmentAvailable: raw.installment_available ?? false,
    readyForPossession: raw.ready_for_possession ?? false,
    amenities: raw.amenities ?? [],
    email: raw.contact_email ?? null,
    phone: raw.contact_phone ?? null,
    whatsapp: raw.whatsapp ?? null,
    videoUrl: raw.video_url ?? null,
    images: (raw.images ?? []).map(imageUrl),
    status: status === "APPROVED" || status === "REJECTED" ? status : "PENDING",
  };
}

export const PAGE_SIZE = 12;

export async function getProperties(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
  const type = filters.type?.toLowerCase();
  const page = Number(filters.page ?? 1);
  const response = await http.get<ApiProperty[]>("/properties", {
    params: {
      city: filters.city || undefined,
      property_type: type === "flat" ? "apartment" : type || undefined,
      listing_type: filters.listingType?.toLowerCase() || undefined,
      min_price: filters.minPrice || undefined,
      max_price: filters.maxPrice || undefined,
      search: filters.q || undefined,
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
    },
  });
  const data = response.data.map(normalizeProperty);
  return { data, total: data.length, page };
}

export async function getProperty(id: string): Promise<Property | null> {
  try {
    const response = await http.get<ApiProperty>(`/properties/${id}`);
    return normalizeProperty(response.data);
  } catch {
    return null;
  }
}
