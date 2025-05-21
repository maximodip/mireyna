import { notFound } from "next/navigation";
import { getProduct } from "@/app/actions/products";
import EditProductForm from "@/components/dashboard/edit-product-form";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const product = await getProduct(params.id);

    return (
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <EditProductForm product={product} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}
