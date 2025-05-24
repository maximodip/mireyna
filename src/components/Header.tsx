import Link from "next/link";
import { CartDropdown } from "./cart/cart-dropdown";

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="text-2xl font-bold">
          MiReyna
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
          <Link href="/dashboard" className="font-medium text-red-500">
            Admin
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <CartDropdown />
        </div>
      </div>
    </header>
  );
}
