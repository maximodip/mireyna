import Link from "next/link";
import { CartDropdown } from "@/components/cart/cart-dropdown";

export function SiteHeader() {
  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          MiReyna Artesanías
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/products" className="hover:text-primary">
            Productos
          </Link>
          <CartDropdown />
        </nav>
      </div>
    </header>
  );
}
