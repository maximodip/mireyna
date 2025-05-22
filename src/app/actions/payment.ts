"use server";

import { getPaymentClient } from "@/utils/mercadopago";
import { createSupabaseClient } from "@/utils/supabase/server";

export async function getPaymentStatus(orderId: string) {
  try {
    const supabase = await createSupabaseClient();
    console.log("✅ Supabase client created");

    // Get the order
    const { data: order, error } = await supabase
      .from("orders")
      .select("payment_id, status")
      .eq("id", orderId)
      .single();

    console.log("🔍 Fetched order:", order);

    if (error || !order) {
      console.error("❌ Order not found or error in Supabase:", error);
      throw new Error(`Order not found: ${error?.message || "Unknown error"}`);
    }

    // If we don't have a payment ID, return the current status
    if (!order.payment_id) {
      console.warn(
        "⚠️ Order has no payment_id, returning current status:",
        order.status
      );
      return { status: order.status };
    }

    // Get the payment client
    const payment = getPaymentClient();
    console.log("✅ MercadoPago client created");

    try {
      // Try to get the payment status from MercadoPago
      console.log("🟡 Fetching payment data for ID:", order.payment_id);
      const paymentData = await payment.get({ id: order.payment_id });
      console.log("✅ MercadoPago payment data:", paymentData);

      // Update the order status if needed
      if (paymentData && paymentData.status) {
        const newStatus = mapPaymentStatus(paymentData.status);
        console.log(
          `📝 Comparing statuses → current: ${order.status}, new: ${newStatus}`
        );

        if (newStatus !== order.status) {
          console.log("🔄 Updating order status in Supabase...");
          await supabase
            .from("orders")
            .update({
              status: newStatus,
              payment_details: paymentData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", orderId);

          console.log("✅ Order updated successfully.");
          return { status: newStatus, updated: true };
        }
      }

      console.log("No update needed. Returning current status.");
      return { status: order.status };
    } catch (paymentError) {
      console.error(
        "❌ Error fetching payment from MercadoPago:",
        paymentError
      );
      return { status: order.status };
    }
  } catch (error) {
    console.error("❌ Error in getPaymentStatus:", error);
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
