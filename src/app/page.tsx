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
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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
        <div className="container mx-auto py-12 px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Nuestros Productos</h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <Card key={index} className="overflow-hidden flex flex-col">
                <div className="aspect-square relative bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded-md" />
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted animate-pulse rounded-md" />
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded-md" />
                    <div className="h-6 w-1/4 bg-muted animate-pulse rounded-md mt-2" />
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded-md mt-1" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
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
                <Link href={`/products/${product.id}`}>
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
                </Link>
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
