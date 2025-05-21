import { createSupabaseClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { getPaymentClient } from "@/utils/mercadopago";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate webhook
    if (!body.action || !body.data || !body.data.id) {
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      );
    }

    // Only process payment.updated or payment.created events
    if (
      body.action !== "payment.updated" &&
      body.action !== "payment.created"
    ) {
      return NextResponse.json(
        { message: "Ignored event type" },
        { status: 200 }
      );
    }

    const paymentId = body.data.id;

    // Get MercadoPago payment client
    const payment = getPaymentClient();

    // Get payment details
    const paymentData = await payment.get({ id: paymentId });

    if (!paymentData || !paymentData.external_reference) {
      return NextResponse.json(
        { error: "Payment not found or missing external reference" },
        { status: 400 }
      );
    }

    const orderId = paymentData.external_reference;
    const status = paymentData.status;

    // Create a service role client to bypass RLS
    const supabaseAdmin = await createSupabaseClient();

    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        status: mapPaymentStatus(status || ""),
        payment_details: paymentData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json(
        { error: "Error updating order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
