import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase error:", error);
    return <div>Error loading product: {error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-gray-900">
              Productos
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          <p className="text-2xl font-semibold text-gray-900">
            $
            {product.price.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center space-x-2">
            <span
              className={`inline-block w-3 h-3 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span className="text-sm text-gray-600">{product.stock}</span>
            <span className="text-sm text-gray-600">
              {product.stock > 0 ? "Disponibles" : "Sin stock"}
            </span>
          </div>

          <button
            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.stock <= 0}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((product) => (
            <Link key={id} href={`/products/${id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">
                    {name}
                  </h3>
                  <p className="mt-2 text-gray-900">
                    $
                    {price.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div> */}
      </div>
    </div>
  );
}
