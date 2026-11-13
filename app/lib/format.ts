export function formatPrice(n: number) {
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(2)} Crore`;
  if (n >= 100_000) return `PKR ${(n / 100_000).toFixed(1)} Lakh`;
  return `PKR ${n.toLocaleString()}`;
}

export const typeLabel: Record<string, string> = {
  HOUSE: "House",
  FLAT: "Flat",
  PLOT: "Plot",
  COMMERCIAL: "Commercial",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}