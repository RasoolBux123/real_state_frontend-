import { http } from "./http";

export async function sendInquiry(propertyId: string, message: string): Promise<void> {
  await http.post("/inquiries", { property_id: Number(propertyId), message });
}

// datetimeLocal = value of <input type="datetime-local"> => converted to ISO with timezone
export async function requestVisit(propertyId: string, datetimeLocal: string, message?: string) {
  await http.post("/visits", {
    property_id: Number(propertyId),
    visit_date: new Date(datetimeLocal).toISOString(),
    message: message?.trim() || null,
  });
}
