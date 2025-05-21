"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { AlertCircle } from "lucide-react";

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Pago fallado</h1>
          <p className="text-muted-foreground mb-6">
            No pudimos procesar tu pago. Por favor, intenta nuevamente o
            contacta al soporte.
          </p>
          {orderId && (
            <p className="text-sm mb-6">
              Numero de la orden: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/cart">Volver al carrito</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/products">Continuar comprando</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
