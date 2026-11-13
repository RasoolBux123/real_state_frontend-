import { http } from "./http";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  kind: "message" | "callback" | "viewing";
  message: string;
};

export async function sendContact(payload: ContactPayload): Promise<void> {
  await http.post("/contact", payload);
}
