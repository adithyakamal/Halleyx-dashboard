import { CustomerOrder } from "@/types/order";

const STORAGE_KEY = "dashboard_orders";

// Sample seed data
const seedOrders: CustomerOrder[] = [
  {
    id: "ORD-001",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "555-0101",
    address: "123 Oak St",
    city: "Austin",
    state: "TX",
    postalCode: "73301",
    country: "USA",
    product: "Fiber Internet 1 Gbps",
    quantity: 2,
    unitPrice: 89.99,
    totalAmount: 179.98,
    status: "Completed",
    createdBy: "Michael Harris",
    createdAt: "2025-12-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob@example.com",
    phone: "555-0102",
    address: "456 Pine Ave",
    city: "Denver",
    state: "CO",
    postalCode: "80201",
    country: "USA",
    product: "5G Unlimited Mobile Plan",
    quantity: 5,
    unitPrice: 79.99,
    totalAmount: 399.95,
    status: "Pending",
    createdBy: "Ryan Cooper",
    createdAt: "2026-01-20T14:15:00Z",
  },
  {
    id: "ORD-003",
    firstName: "Clara",
    lastName: "Davis",
    email: "clara@example.com",
    phone: "555-0103",
    address: "789 Elm Blvd",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "USA",
    product: "Business Internet 500 Mbps",
    quantity: 1,
    unitPrice: 129.99,
    totalAmount: 129.99,
    status: "In progress",
    createdBy: "Olivia Carter",
    createdAt: "2026-02-10T09:00:00Z",
  },
  {
    id: "ORD-004",
    firstName: "David",
    lastName: "Lee",
    email: "david@example.com",
    phone: "555-0104",
    address: "321 Maple Dr",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "USA",
    product: "VoIP Corporate Package",
    quantity: 3,
    unitPrice: 199.99,
    totalAmount: 599.97,
    status: "Completed",
    createdBy: "Lucas Martin",
    createdAt: "2026-02-28T16:45:00Z",
  },
  {
    id: "ORD-005",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma@example.com",
    phone: "555-0105",
    address: "654 Cedar Ln",
    city: "Portland",
    state: "OR",
    postalCode: "97201",
    country: "USA",
    product: "Fiber Internet 300 Mbps",
    quantity: 4,
    unitPrice: 49.99,
    totalAmount: 199.96,
    status: "Pending",
    createdBy: "Michael Harris",
    createdAt: "2026-03-05T11:20:00Z",
  },
  {
    id: "ORD-006",
    firstName: "Frank",
    lastName: "Brown",
    email: "frank@example.com",
    phone: "555-0106",
    address: "987 Birch Ct",
    city: "Miami",
    state: "FL",
    postalCode: "33101",
    country: "USA",
    product: "Fiber Internet 1 Gbps",
    quantity: 1,
    unitPrice: 89.99,
    totalAmount: 89.99,
    status: "In progress",
    createdBy: "Ryan Cooper",
    createdAt: "2026-03-10T08:30:00Z",
  },
];

export function getOrders(): CustomerOrder[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
    return seedOrders;
  }
  return JSON.parse(stored);
}

export function addOrder(order: CustomerOrder): void {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function updateOrder(updated: CustomerOrder): void {
  const orders = getOrders().map((o) => (o.id === updated.id ? updated : o));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function deleteOrder(id: string): void {
  const orders = getOrders().filter((o) => o.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function setOrders(orders: CustomerOrder[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function generateOrderId(): string {
  const orders = getOrders();
  const num = orders.length + 1;
  return `ORD-${String(num).padStart(3, "0")}`;
}
