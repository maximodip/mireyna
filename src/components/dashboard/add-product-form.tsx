"use client";

import type React from "react";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/app/actions/products";
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
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

export default function AddProductForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
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
      console.log("Cloudinary response:", data);

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
      let finalImageUrl = null;
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
          await createProduct(formData);

          toast.success("Product added", {
            description: "Your product has been added successfully.",
          });

          router.push("/dashboard/products");
          router.refresh();
        } catch (error: unknown) {
          toast.error("Error adding product", {
            description:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
        }
      });
    } catch (error: unknown) {
      toast.error("Error adding product", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Add a new product to your inventory.</CardDescription>
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
              {isPending ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
