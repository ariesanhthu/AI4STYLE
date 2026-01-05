"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "../types/schema";
import { OptionList } from "./OptionList";
import productService from "../services/product.service";
import categoryService from "../../admin-categories/services/admin-category.service"; // Adjust import path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryTreeItemWithLevel } from "../../admin-categories/types/category.type"; // Adjust import path
import { Product } from "../types/product.type";

interface ProductFormProps {
  onSuccess?: () => void;
  editingProduct?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, editingProduct }) => {
  const [categories, setCategories] = useState<CategoryTreeItemWithLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // console.log("Editing form:", editingProduct);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product: editingProduct ? {
        name: editingProduct.name,
        categoryId: editingProduct.categoryId,
        options: editingProduct.options,
      } : {
        name: "",
        categoryId: "",
        options: [],
      },
    },
  });

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        // Using the existing service, assuming it returns the tree structure.
        // We might want to flatten it or just show top levels? 
        // For now, let's just fetch and if it's a tree, we might need to handle display.
        // The service returns CategoryTreeItemWithLevel[]
        const data = await categoryService.getAllCategory();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        // Prepare update payload
        const currentOptions = data.product.options;
        const originalOptions = editingProduct.options || [];

        // 1. Existing options to update (Must have optionId)
        const optionsToUpdate = currentOptions
          .filter((opt: any) => opt.optionId)
          .map((opt: any) => ({
            optionId: opt.optionId,
            name: opt.name,
            color: opt.color || "#000000",
            colorFamily: opt.colorFamily || "General",
            thumbnail: opt.thumbnail || opt.images?.[0] || "",
            images: opt.images || [],
            isShow: opt.isShow ?? true,
          }));
        console.log("Options to update:", optionsToUpdate);

        // 2. New options to create (Do NOT have optionId)
        const newOptions = currentOptions
          .filter((opt: any) => !opt.optionId)
          .map((opt: any) => ({
            name: opt.name,
            color: opt.color || "#000000",
            colorFamily: opt.colorFamily || "General",
            thumbnail: opt.thumbnail || opt.images?.[0] || "",
            images: opt.images || [],
            isShow: opt.isShow ?? true,
            variants: opt.variants?.map((v: any) => ({
              sku: v.sku,
              size: v.size,
              price: Number(v.price),
              newPrice: v.newPrice ? Number(v.newPrice) : null,
              stockQuantity: Number(v.stockQuantity),
            })) || []
          }));
        console.log("New options to create:", newOptions);

        // 3. Deleted options (In original but NOT in current form data)
        const currentOptionIds = new Set(
          currentOptions
            .filter((opt: any) => opt.optionId)
            .map((opt: any) => opt.optionId)
        );
        console.log("Current option IDs:", currentOptionIds);

        const deleteOptionIds = originalOptions
          .filter((opt: any) => !currentOptionIds.has(opt.optionId))
          .map((opt: any) => opt.optionId);
        console.log("Delete option IDs:", deleteOptionIds);

        const updatePayload: any = {
          categoryId: data.product.categoryId,
          name: data.product.name,
          description: (data.product as any).description || "",
          options: optionsToUpdate,
          newOptions: newOptions,
          deleteOptionIds: deleteOptionIds,
        };

        await productService.updateProduct(editingProduct.productId, updatePayload);
      } else {
        // Create payload
        const createPayload = {
          ...data.product,
          options: data.product.options.map((opt: any) => ({
            ...opt,
            isShow: opt.isShow ?? true,
            color: opt.color || "#000000",
            colorFamily: opt.colorFamily || "General",
            thumbnail: opt.thumbnail || opt.images?.[0] || ""
          }))
        };
        console.log("Submitting create payload:", JSON.stringify(createPayload, null, 2));
        await productService.createProduct(createPayload as any);
      }

      alert("Product saved successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Product</h1>
          {/* "Add" button in header was in requirements, but here we ARE in the add form. 
              Maybe "Cancel" or just nothing. The Submit is at bottom. */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="product.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="product.categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.categoryId} value={String(cat.categoryId)}>
                            {/* Indent based on level for visual hierarchy */}
                            <span style={{ paddingLeft: `${(cat.level || 0) * 10}px` }}>
                              {cat.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Variants Section - The Blue Blocks */}
        <OptionList />

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Saving..." : "Submit"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
