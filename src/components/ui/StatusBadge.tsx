import { OrderStatus } from "@/types/order";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const cls =
    status === "Pending"
      ? "status-pending"
      : status === "In progress"
      ? "status-in-progress"
      : "status-completed";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}
