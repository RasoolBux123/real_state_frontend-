import { http } from "./http";
import type { Property } from "../types";
import type { PropertyPayload } from "../components/PropertyForm";
import { normalizeProperty, type ApiProperty } from "./api";

type CreatedProperty = { id: number | string; status: string };

export async function getMyProperties(): Promise<Property[]> {
  const response = await http.get<ApiProperty[]>("/properties/my");
  return response.data.map(normalizeProperty);
}

export async function deleteMyProperty(id: string): Promise<void> {
  await http.delete(`/properties/${id}`);
}

// Creates the listing, then uploads its photos. If the photos fail the listing is removed again.
export async function createProperty(data: PropertyPayload): Promise<CreatedProperty> {
  const response = await http.post<CreatedProperty>("/properties", {
    title: data.title,
    description: data.description,
    city: data.city,
    location: data.address,
    address: data.plotNumber ? `${data.plotNumber}, ${data.address}` : data.address,
    property_type: data.type === "FLAT" ? "apartment" : data.type.toLowerCase(),
    listing_type: data.listingType.toLowerCase(),
    price: data.price,
    area: data.areaSqft,
    bedrooms: data.bedrooms ?? 0,
    bathrooms: data.bathrooms ?? 0,
    sub_type: data.subType,
    area_size: data.areaSize,
    area_unit: data.areaUnit,
    installment_available: data.installmentAvailable,
    ready_for_possession: data.readyForPossession,
    amenities: data.amenities,
    contact_email: data.email || null,
    contact_phone: data.phone || null,
    whatsapp: data.whatsapp,
    video_url: data.videoUrl,
  });

  if (data.images.length > 0) {
    const form = new FormData();
    data.images.forEach((image) => form.append("images", image));
    try {
      await http.post(`/property-images/${response.data.id}/upload`, form);
    } catch (error) {
      await http.delete(`/properties/${response.data.id}`).catch(() => undefined);
      throw error;
    }
  }

  return response.data;
}
