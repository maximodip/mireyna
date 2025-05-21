"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/actions/auth";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/dashboard/products",
    color: "text-violet-500",
  },
  {
    label: "Orders",
    icon: ShoppingCart,
    href: "/dashboard/orders",
    color: "text-pink-700",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/dashboard/customers",
    color: "text-orange-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-full border-r bg-card flex flex-col w-64">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <div className="flex flex-col flex-1 py-4 px-3 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-md transition-colors",
              pathname === route.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-primary"
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="p-4 mt-auto border-t">
        <form action={signOut}>
          <Button
            variant="outline"
            className="w-full justify-start"
            type="submit"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
