import { Property } from "../types";

const styles: Record<Property["status"], string> = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: Property["status"] }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}