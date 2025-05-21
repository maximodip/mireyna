"use client";

import { useState } from "react";
import { getProducts } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { SiteHeader } from "@/components/site-header";
import { useEffect } from "react";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <>
        <SiteHeader />
        <div className="container mx-auto py-12 px-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Nuestros Productos</h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay productos disponibles en este momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden flex flex-col">
                <div className="aspect-square relative bg-muted">
                  {product.image ? (
                    <Image
                      fill
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No imagen disponible
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-xl font-bold mt-2">{product.price}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.stock > 0
                      ? `${product.stock} en stock`
                      : "Sin stock"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={product.stock <= 0}
                    onClick={() => addItem(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
