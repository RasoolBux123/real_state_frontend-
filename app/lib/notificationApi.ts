import { http } from "./http";
import type { AppNotification } from "../types";

type Raw = { id: number; title: string; body: string; link?: string | null; is_read: boolean; created_at: string };

export async function getNotifications(): Promise<{ data: AppNotification[]; unread: number }> {
  const res = await http.get<{ data: Raw[]; unread: number }>("/notifications");
  return {
    unread: res.data.unread,
    data: res.data.data.map((n) => ({
      id: String(n.id),
      title: n.title,
      body: n.body,
      link: n.link ?? null,
      read: n.is_read,
      createdAt: n.created_at,
    })),
  };
}

export async function markAllRead(): Promise<void> {
  await http.post("/notifications/read-all");
}
