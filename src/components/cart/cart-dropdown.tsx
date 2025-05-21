"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export function CartDropdown() {
  const { items, removeItem, updateQuantity, totalItems, subtotal } = useCart();
  const [open, setOpen] = useState(false);

  if (totalItems === 0) {
    return (
      <Button variant="outline" size="icon" asChild>
        <Link href="/cart">
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Cart</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
          <span className="sr-only">Carrito de compras</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-4">
          <h3 className="font-medium">Tu Carrito</h3>
          <p className="text-sm text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto">
          {items?.map((item) => (
            <DropdownMenuItem key={item.id} className="flex p-4 cursor-default">
              <div className="flex items-center gap-4 w-full">
                <div className="h-10 w-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {item.image ? (
                    <Image
                      width={40}
                      height={40}
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.preventDefault();
                      updateQuantity(item.id, item.quantity - 1);
                    }}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Disminuir cantidad</span>
                  </Button>
                  <span className="w-4 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.preventDefault();
                      updateQuantity(item.id, item.quantity + 1);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Aumentar cantidad</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      removeItem(item.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Eliminar item</span>
                  </Button>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between font-medium">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button className="w-full" asChild onClick={() => setOpen(false)}>
            <Link href="/cart">Ver Carrito & Checkout</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
