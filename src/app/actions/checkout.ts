"use server";

import type { CartItem } from "@/contexts/cart-context";
import { createSupabaseClient } from "@/utils/supabase/server";
import { getPreferenceClient } from "@/utils/mercadopago";

export async function initiateCheckout(
  items: CartItem[],
  customerEmail?: string
) {
  try {
    // Get MercadoPago clients
    const preference = getPreferenceClient();

    // Create order in database
    const supabase = await createSupabaseClient();

    // Get current user if authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    // Create the order
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: userId, // This can be null for guest checkout
        status: "pendiente",
        total_amount: items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        items: items,
        customer_email: customerEmail || session?.user?.email || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      throw new Error(`Error creating order: ${error.message}`);
    }

    // Create MercadoPago preference
    const result = await preference.create({
      body: {
        items: items.map((item) => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          currency_id: "ARS",
          picture_url: item.image || undefined,
        })),
        back_urls: {
          success: "http://localhost:3000/checkout/success",
          failure: "http://localhost:3000/checkout/failure",
          pending: "http://localhost:3000/checkout/pending",
        },
        external_reference: order.id,
        // auto_return: "approved",
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 1,
        },
      },
    });

    // Update order with preference id and initial status
    await supabase
      .from("orders")
      .update({
        payment_id: result.id,
        status: "pending",
      })
      .eq("id", order.id);

    // Return a plain object instead of NextResponse
    return {
      url: result.init_point,
      order_id: order.id,
    };
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    throw new Error(
      `Error initiating checkout: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
