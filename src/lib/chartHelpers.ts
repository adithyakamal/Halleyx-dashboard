import { CustomerOrder } from "@/types/order";

export type DateFilter = "all" | "today" | "7days" | "30days" | "90days";

export function filterOrdersByDate(
  orders: CustomerOrder[],
  filter: DateFilter
): CustomerOrder[] {
  if (filter === "all") return orders;

  const now = new Date();
  const cutoff = new Date();

  switch (filter) {
    case "today":
      cutoff.setHours(0, 0, 0, 0);
      break;
    case "7days":
      cutoff.setDate(now.getDate() - 7);
      break;
    case "30days":
      cutoff.setDate(now.getDate() - 30);
      break;
    case "90days":
      cutoff.setDate(now.getDate() - 90);
      break;
  }

  return orders.filter((o) => new Date(o.createdAt) >= cutoff);
}

export function getProductDistribution(orders: CustomerOrder[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    map[o.product] = (map[o.product] || 0) + o.quantity;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getStatusDistribution(orders: CustomerOrder[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    map[o.status] = (map[o.status] || 0) + 1;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

export function getRevenueOverTime(orders: CustomerOrder[]) {
  const map: Record<string, number> = {};
  const sorted = [...orders].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  sorted.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    map[date] = (map[date] || 0) + o.totalAmount;
  });
  return Object.entries(map).map(([date, revenue]) => ({ date, revenue }));
}

export function getRevenueByProduct(orders: CustomerOrder[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    map[o.product] = (map[o.product] || 0) + o.totalAmount;
  });
  return Object.entries(map).map(([name, revenue]) => ({ name, revenue }));
}

export function getOrdersByCreator(orders: CustomerOrder[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => {
    map[o.createdBy] = (map[o.createdBy] || 0) + 1;
  });
  return Object.entries(map).map(([name, count]) => ({ name, count }));
}
