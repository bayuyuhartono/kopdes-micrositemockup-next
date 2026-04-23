import { CartItem } from "@/context/CartContext";

export interface StoredOrder {
  orderId: string;
  name: string;
  phone: string;
  delivery: "pickup" | "delivery";
  address: string;
  payment: string;
  paymentType: "va" | "qris";
  paymentLabel: string;
  vaNumber: string;
  items: CartItem[];
  totalPrice: number;
  status: "unpaid" | "paid";
  createdAt: string;
}

export function saveOrderToHistory(order: StoredOrder) {
  try {
    const raw = localStorage.getItem("simkopdes_orders");
    const existing: StoredOrder[] = raw ? JSON.parse(raw) : [];
    const updated = [order, ...existing.filter((o) => o.orderId !== order.orderId)];
    localStorage.setItem("simkopdes_orders", JSON.stringify(updated));
  } catch {
    // ignore
  }
}
