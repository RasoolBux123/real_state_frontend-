import { http } from "./http";
import { normalizeProperty, type ApiProperty } from "./api";
import type { Property } from "../types";

export async function getFavorites(): Promise<Property[]> {
  const res = await http.get<{ property: ApiProperty }[]>("/favorites");
  return res.data.map((f) => normalizeProperty(f.property));
}
export async function addFavorite(id: string) {
  await http.post(`/favorites/${id}`);
}
export async function removeFavorite(id: string) {
  await http.delete(`/favorites/${id}`);
}
