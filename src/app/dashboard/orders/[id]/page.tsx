import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Package } from "lucide-react";
import { getPaymentStatus } from "@/app/actions/payment";
import Image from "next/image";
import { CartItem } from "@/contexts/cart-context";

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseClient();

  // Get the order
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !order) {
    notFound();
  }

  // Check payment status
  let paymentStatus;
  try {
    paymentStatus = await getPaymentStatus(params.id);
  } catch (error) {
    console.error("Error checking payment status:", error);
    // Set a default status to prevent undefined errors
    paymentStatus = { status: order.status };
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      case "refunded":
        return "bg-purple-500";
      case "cancelled":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
        </div>
        <Badge
          className={getStatusColor(paymentStatus?.status || order.status)}
        >
          {(paymentStatus?.status || order.status).charAt(0).toUpperCase() +
            (paymentStatus?.status || order.status).slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Order ID
              </h3>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Date
              </h3>
              <p>{new Date(order.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Customer
              </h3>
              <p>{order.customer_email || "Guest"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Payment ID
              </h3>
              <p className="font-mono text-sm">{order.payment_id || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total
              </h3>
              <p className="text-lg font-bold">
                {formatPrice(order.total_amount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(order.items) && order.items.length > 0 ? (
                order.items.map((item: CartItem, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-2 border-b last:border-0"
                  >
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      {item.image ? (
                        <Image
                          width={48}
                          height={48}
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No items found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {order.payment_details && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto text-xs">
                {JSON.stringify(order.payment_details, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
