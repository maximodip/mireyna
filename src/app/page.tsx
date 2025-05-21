import { getProducts } from "@/app/actions/products";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-12 bg-gray-50">
          <div className="container px-4 mx-auto">
            <h1 className="mb-4 text-4xl font-bold text-center">
              Bienvenido a Mi Reyna
            </h1>
            <p className="max-w-2xl mx-auto mb-8 text-center text-gray-600">
              Descubre nuestra colección de productos premium diseñados para tu
              estilo de vida.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container px-4 mx-auto">
            <h2 className="mb-8 text-2xl font-bold">Productos</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="cursor-pointer overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                >
                  <div className="relative h-64">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      {product.name}
                    </h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {product.description.length > 100
                        ? product.description.slice(0, 100) + "..."
                        : product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                      <Button size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Añadir al Carrito
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">MiReyna</h3>
              <p className="text-gray-400">
                Tu tienda de confianza para productos premium.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/">Inicio</Link>
                </li>
                <li>
                  <Link href="/products">Productos</Link>
                </li>
                <li>
                  <Link href="/categories">Categorías</Link>
                </li>
                <li>
                  <Link href="/about">Nosotros</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
              <address className="not-italic text-gray-400">
                Calle Comercio 123
                <br />
                Ciudad Retail, CR 10001
                <br />
                contacto@mireyna.com
                <br />
                (555) 123-4567
              </address>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-gray-400 border-t border-gray-800">
            <p>
              &copy; {new Date().getFullYear()} MiReyna. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
