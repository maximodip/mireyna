"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold">Página no encontrada</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida. Por favor, regresa a nuestra tienda para continuar
            comprando.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Volver a la tienda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
