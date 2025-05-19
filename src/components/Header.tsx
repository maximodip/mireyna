import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="text-2xl font-bold">
          TiendaYa
        </Link>
        <nav className="hidden space-x-6 md:flex">
          <Link href="/" className="font-medium">
            Inicio
          </Link>
          <Link href="/products" className="font-medium">
            Productos
          </Link>
          <Link href="/categories" className="font-medium">
            Categorías
          </Link>
          <Link href="/about" className="font-medium">
            Nosotros
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <ShoppingCart className="w-5 h-5" />
            <span className="sr-only">Carrito de Compras</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
