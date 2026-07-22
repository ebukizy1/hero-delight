import { supabase } from "./supabase";
import type { CartItem } from "./cart";

export type PaymentMethod = "cod" | "card";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderStatus = "new" | "processing" | "delivered" | "cancelled";

export interface DbOrder {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  notes: string | null;
  items: CartItem[];
  subtotal: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  status: OrderStatus;
}

export interface OrderInput {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
}

export async function createOrder(input: OrderInput): Promise<DbOrder> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      phone: input.phone,
      email: input.email || null,
      address: input.address,
      city: input.city || null,
      notes: input.notes || null,
      items: input.items,
      subtotal: input.subtotal,
      total: input.total,
      payment_method: input.paymentMethod,
      payment_status: "pending",
      status: "new",
    })
    .select()
    .single();
  if (error) throw error;
  return data as DbOrder;
}

export async function fetchOrder(id: string): Promise<DbOrder | null> {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
  if (error) return null;
  return data as DbOrder;
}

export async function fetchOrders(): Promise<DbOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as DbOrder[];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function markOrderPaid(id: string, reference: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: "paid", payment_reference: reference })
    .eq("id", id);
  if (error) throw error;
}
