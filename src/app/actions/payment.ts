"use server";

import { getPaymentClient } from "@/utils/mercadopago";
import { createSupabaseClient } from "@/utils/supabase/server";

export async function getPaymentStatus(orderId: string) {
  try {
    const supabase = await createSupabaseClient();

    // Get the order
    const { data: order, error } = await supabase
      .from("orders")
      .select("payment_id, status")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      throw new Error(`Order not found: ${error?.message || "Unknown error"}`);
    }

    // If we don't have a payment ID, return the current status
    if (!order.payment_id) {
      return { status: order.status };
    }

    // Get the payment client
    const payment = getPaymentClient();

    try {
      // Try to get the payment status from MercadoPago
      const paymentData = await payment.get({ id: order.payment_id });

      // Update the order status if needed
      if (paymentData && paymentData.status) {
        const newStatus = mapPaymentStatus(paymentData.status);

        if (newStatus !== order.status) {
          await supabase
            .from("orders")
            .update({
              status: newStatus,
              payment_details: paymentData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          return { status: newStatus, updated: true };
        }
      }

      return { status: order.status };
    } catch (paymentError) {
      console.error("Error fetching payment:", paymentError);
      // If we can't get the payment, just return the current status
      return { status: order.status };
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw error;
  }
}

// Map MercadoPago payment status to our order status
function mapPaymentStatus(mpStatus: string): string {
  switch (mpStatus) {
    case "approved":
      return "completed";
    case "pending":
      return "pending";
    case "in_process":
      return "processing";
    case "rejected":
      return "failed";
    case "refunded":
      return "refunded";
    case "cancelled":
      return "cancelled";
    case "in_mediation":
      return "disputed";
    default:
      return "pending";
  }
}
