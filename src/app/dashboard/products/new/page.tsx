import AddProductForm from "@/components/dashboard/add-product-form";

export default function NewProductPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Agregar nuevo producto</h1>
      <AddProductForm />
    </div>
  );
}
