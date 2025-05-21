"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProduct, deleteProduct } from "@/app/actions/products";
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
import { Loader2, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export default function EditProductForm({ product }: { product: Product }) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.image_url || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Handle image upload to Cloudinary
  const handleImageUpload = async () => {
    if (!imageFile) return null;

    try {
      setUploading(true);

      // Create form data for upload
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "products"); // Your Cloudinary upload preset

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

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    try {
      // Upload image to Cloudinary if selected
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await handleImageUpload();
        if (!finalImageUrl) {
          toast.error("Image upload failed", {
            description:
              "There was an error uploading your image. Please try again.",
          });
          return;
        }
      }

      // Add the image URL to the form data
      formData.append("imageUrl", finalImageUrl || "");

      startTransition(async () => {
        try {
          await updateProduct(product.id, formData);

          toast.success("Product updated", {
            description: "Your product has been updated successfully.",
          });

          router.push("/dashboard/products");
          router.refresh();
        } catch (error: unknown) {
          toast.error("Error updating product", {
            description:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
        }
      });
    } catch (error: unknown) {
      toast.error("Error updating product", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await deleteProduct(product.id);

      toast.success("Product deleted", {
        description: "Your product has been deleted successfully.",
      });

      router.push("/dashboard/products");
      router.refresh();
    } catch (error: unknown) {
      toast.error("Error deleting product", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Update your product details.</CardDescription>
        </div>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  defaultValue={product.name}
                  required
                  minLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  defaultValue={product.price}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  defaultValue={product.stock}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter product description"
                  className="min-h-[120px]"
                  defaultValue={product.description}
                  required
                  minLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
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
                        Click to upload image
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
                  Recommended size: 800x800px. Max size: 5MB.
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
              disabled={isPending || uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || uploading}>
              {(isPending || uploading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isPending ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
