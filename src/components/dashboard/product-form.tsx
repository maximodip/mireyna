"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  stock: z.coerce.number().int().nonnegative({
    message: "El stock debe ser un número entero no negativo.",
  }),
});

// Update the component props to accept initialData
export default function ProductForm({
  initialData,
}: {
  initialData: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
  };
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const isEditing = !!initialData;

  // Initialize form with initialData if provided
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
    },
  });

  // Handle image upload to Cloudinary
  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "products"); // Your Cloudinary upload preset
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        return data.secure_url;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Update the onSubmit function
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);

      // Upload image to Cloudinary if selected
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await handleImageUpload();
        if (!finalImageUrl) {
          toast.error("Error al subir la imagen");
          return;
        }
      }

      if (isEditing) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: values.name,
            description: values.description,
            price: values.price,
            stock: values.stock,
            image: finalImageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast.success("Producto actualizado", {
          description: "Tu producto ha sido actualizado exitosamente.",
        });
      } else {
        // Insert new product
        const { error } = await supabase.from("products").insert([
          {
            name: values.name,
            description: values.description,
            price: values.price,
            stock: values.stock,
            image: finalImageUrl,
          },
        ]);

        if (error) throw error;

        toast.success("Producto agregado", {
          description: "Tu producto ha sido agregado exitosamente.",
        });
      }

      // Redirect to products page
      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Hubo un error al guardar tu producto.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Update the handleDelete function
  const handleDelete = async () => {
    try {
      setSubmitting(true);

      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", initialData.id);

      if (error) throw error;

      toast.success("Producto eliminado", {
        description: "Tu producto ha sido eliminado exitosamente.",
      });

      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Hubo un error al eliminar tu producto.",
      });
    } finally {
      setSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };

  // Add a delete button to the form
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>
            {isEditing ? "Editar Producto" : "Agregar nuevo producto"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Actualiza los detalles de tu producto."
              : "Agrega un nuevo producto a tu inventario."}
          </CardDescription>
        </div>
        {isEditing && (
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente el producto.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Producto</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ingresa el nombre del producto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingresa la descripción del producto"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label htmlFor="image">Imagen del producto</Label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 h-[120px]">
                    {imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          width={100}
                          height={100}
                          src={imageUrl || "/placeholder.svg"}
                          alt="Product preview"
                          className="w-full h-full object-contain"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-0 right-0"
                          onClick={() => {
                            setImageUrl(null);
                            setImageFile(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Haz clic para subir una imagen
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tamaño recomendado: 800x800px. Tamaño máximo: 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => router.push("/dashboard/products")}
                disabled={submitting || uploading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting || uploading}>
                {(submitting || uploading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitting ? "Guardando..." : "Guardar Producto"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
