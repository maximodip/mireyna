"use server";

import { createSupabaseClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export const getProducts = async () => {
  const supabase = await createSupabaseClient();
  const { data: products } = await supabase.from("products").select();
  return products;
};

export async function getProduct(id: string) {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Error loading product: ${error.message}`);
  }

  return data;
}

export async function createProduct(formData: FormData) {
  const supabase = await createSupabaseClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number.parseFloat(formData.get("price") as string);
  const stock = Number.parseInt(formData.get("stock") as string);
  const imageUrl = (formData.get("imageUrl") as string) || null;

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        price,
        stock,
        image: imageUrl,
      },
    ])
    .select();

  if (error) {
    throw new Error(`Error creating product: ${error.message}`);
  }

  revalidatePath("/dashboard/products");
  return data[0];
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createSupabaseClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number.parseFloat(formData.get("price") as string);
  const stock = Number.parseInt(formData.get("stock") as string);
  const imageUrl = (formData.get("imageUrl") as string) || null;

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      stock,
      image: imageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(`Error updating product: ${error.message}`);
  }

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}`);
  return data[0];
}

export async function deleteProduct(id: string) {
  const supabase = await createSupabaseClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw new Error(`Error deleting product: ${error.message}`);
  }

  revalidatePath("/dashboard/products");
}

export async function getProductStats() {
  const supabase = await createSupabaseClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, stock");

  if (error) {
    throw new Error(`Error loading product stats: ${error.message}`);
  }

  const totalProducts = products?.length || 0;
  const lowStockCount =
    products?.filter((product) => product.stock < 10).length || 0;
  const inStockCount =
    products?.filter((product) => product.stock > 0).length || 0;

  return {
    totalProducts,
    lowStockCount,
    inStockCount,
  };
}
