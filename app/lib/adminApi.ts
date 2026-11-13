import { http } from "./http";
import { normalizeProperty, type ApiProperty } from "./api";
import type { AdminInquiry, AdminProperty, AdminStats, AdminUser, Property } from "../types";

type ApiAdminProperty = ApiProperty & {
  seller_name?: string | null;
  seller_email?: string | null;
  created_at?: string;
};

function toAdminProperty(item: ApiAdminProperty): AdminProperty {
  return {
    ...normalizeProperty(item),
    sellerName: item.seller_name ?? `Seller #${item.seller_id}`,
    sellerEmail: item.seller_email ?? "",
    createdAt: String(item.created_at ?? ""),
  };
}

export async function getAdminStats(): Promise<AdminStats> {
  return (await http.get("/admin/stats")).data;
}

export async function getAdminProperties(status?: Property["status"]): Promise<AdminProperty[]> {
  const res = await http.get<ApiAdminProperty[]>("/admin/properties", {
    params: status ? { status: status.toLowerCase() } : {},
  });
  return res.data.map(toAdminProperty);
}

export async function setPropertyStatus(id: string, status: Property["status"]): Promise<void> {
  await http.patch(`/admin/properties/${id}/status`, { status: status.toLowerCase() });
}

export async function deleteAdminProperty(id: string): Promise<void> {
  await http.delete(`/properties/${id}`);
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await http.get<Record<string, unknown>[]>("/admin/users", { params: { limit: 100 } });
  return res.data.map((u) => {
    const role = String(u.role).toUpperCase();
    return {
      id: String(u.id),
      name: String(u.full_name ?? ""),
      email: String(u.email ?? ""),
      role: role === "ADMIN" ? "ADMIN" : role === "SELLER" ? "SELLER" : "USER",
      createdAt: String(u.created_at ?? ""),
    };
  });
}

export async function deleteAdminUser(id: string): Promise<void> {
  await http.delete(`/admin/users/${id}`);
}

export async function getAdminInquiries(): Promise<AdminInquiry[]> {
  const res = await http.get<Record<string, unknown>[]>("/admin/inquiries");
  return res.data.map((i) => ({
    id: String(i.id),
    kind: String(i.kind) as AdminInquiry["kind"],
    message: String(i.message ?? ""),
    createdAt: String(i.created_at ?? ""),
    propertyId: i.property_id == null ? null : String(i.property_id),
    propertyTitle: String(i.property_title ?? ""),
    buyerName: String(i.name ?? ""),
    buyerEmail: String(i.email ?? ""),
    phone: (i.phone as string | null) ?? null,
    visitDate: (i.visit_date as string | null) ?? null,
    status: String(i.status ?? ""),
  }));
}
