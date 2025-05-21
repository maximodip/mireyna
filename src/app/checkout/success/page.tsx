"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { useCart } from "@/contexts/cart-context";
import { CheckCircle, Loader2 } from "lucide-react";
import { getPaymentStatus } from "@/app/actions/payment";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { clearCart } = useCart();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Clear cart on successful checkout
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Check payment status
  useEffect(() => {
    if (orderId) {
      const checkStatus = async () => {
        try {
          const result = await getPaymentStatus(orderId);
          setStatus(result.status);
        } catch (error) {
          console.error("Error checking payment status:", error);
        } finally {
          setLoading(false);
        }
      };

      checkStatus();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="container mx-auto py-12 px-6">
          <div className="max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verifying payment...</h1>
            <p className="text-muted-foreground">
              Please wait while we verify your payment status.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been successfully
            processed.
          </p>
          {orderId && (
            <p className="text-sm mb-2">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          {status && (
            <p className="text-sm mb-6">
              Status: <span className="font-medium capitalize">{status}</span>
            </p>
          )}
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
