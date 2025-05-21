"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Clock } from "lucide-react";

export default function CheckoutPendingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Pago pendiente</h1>
          <p className="text-muted-foreground mb-6">
            Tu pago está siendo procesado. Te notificaremos cuando esté
            completado.
          </p>
          {orderId && (
            <p className="text-sm mb-6">
              Numero de la orden: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <Button asChild>
            <Link href="/products">Continuar comprando</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
