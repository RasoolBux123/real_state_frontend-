import { http } from "./http";
import type { Suggestion } from "../types";

// On error return an empty list so typing never breaks
export async function getSuggestions(q: string): Promise<Suggestion[]> {
  try {
    const res = await http.get<{ data: Suggestion[] }>("/properties/suggest", { params: { q } });
    return res.data.data;
  } catch {
    return [];
  }
}
