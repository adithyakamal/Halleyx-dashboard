export interface CustomerOrder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: OrderStatus;
  createdBy: CreatedBy;
  createdAt: string;
}

export type Product =
  | "Fiber Internet 300 Mbps"
  | "5G Unlimited Mobile Plan"
  | "Fiber Internet 1 Gbps"
  | "Business Internet 500 Mbps"
  | "VoIP Corporate Package";

export type OrderStatus = "Pending" | "In progress" | "Completed";

export type CreatedBy =
  | "Michael Harris"
  | "Ryan Cooper"
  | "Olivia Carter"
  | "Lucas Martin";

export const PRODUCTS: { label: Product; price: number }[] = [
  { label: "Fiber Internet 300 Mbps", price: 49.99 },
  { label: "5G Unlimited Mobile Plan", price: 79.99 },
  { label: "Fiber Internet 1 Gbps", price: 89.99 },
  { label: "Business Internet 500 Mbps", price: 129.99 },
  { label: "VoIP Corporate Package", price: 199.99 },
];

export const STATUSES: OrderStatus[] = ["Pending", "In progress", "Completed"];

export const CREATED_BY_OPTIONS: CreatedBy[] = [
  "Michael Harris",
  "Ryan Cooper",
  "Olivia Carter",
  "Lucas Martin",
];
