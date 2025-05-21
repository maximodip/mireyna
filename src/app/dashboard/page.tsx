import { ProductStats } from "@/components/dashboard/product-stats";
import { Package, ShoppingCart } from "lucide-react";
import { getProductStats } from "@/app/actions/products";
import { getUser } from "../actions/auth";

export default async function DashboardPage() {
  const user = await getUser();

  const { totalProducts, lowStockCount, inStockCount } =
    await getProductStats();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel de administración</h1>
        <div className="flex items-center gap-4">
          <p>Hola, {user?.email}!</p>
        </div>
      </div>

      <ProductStats
        totalProducts={totalProducts}
        lowStockCount={lowStockCount}
        inStockCount={inStockCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Actividad reciente</h2>
          <div className="text-muted-foreground text-center py-8">
            No hay actividad reciente para mostrar
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/dashboard/products/new"
              className="border rounded-lg p-4 hover:bg-muted transition-colors flex flex-col items-center justify-center text-center"
            >
              <Package className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Agregar producto</span>
            </a>
            <a
              href="/dashboard/products"
              className="border rounded-lg p-4 hover:bg-muted transition-colors flex flex-col items-center justify-center text-center"
            >
              <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
              <span className="font-medium">Ver productos</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
