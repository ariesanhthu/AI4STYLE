"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ProductFormValues } from "../types/schema";

interface VariantListProps {
  variantIndex: number;
}

export const VariantList: React.FC<VariantListProps> = ({ variantIndex }) => {
  const { control } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `product.options.${variantIndex}.variants`,
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id} className="border-green-500/50 bg-green-50/20">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-green-700">Biến thể {index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-2 grid grid-cols-2 md:grid-cols-5 gap-4">
            <FormField
              control={control}
              name={`product.options.${variantIndex}.variants.${index}.size`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Kích thước</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ví dụ: M" className="h-8" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`product.options.${variantIndex}.variants.${index}.sku`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Mã SKU</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SKU" className="h-8" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`product.options.${variantIndex}.variants.${index}.price`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Giá</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-8"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`product.options.${variantIndex}.variants.${index}.newPrice`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Giá mới</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Tùy chọn"
                      className="h-8"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.valueAsNumber;
                        field.onChange(isNaN(val) ? null : val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`product.options.${variantIndex}.variants.${index}.stockQuantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Số lượng tồn kho</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      className="h-8"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full border-green-500 text-green-600 hover:bg-green-50"
        onClick={() =>
          append({
            size: "",
            sku: "",
            price: 0,
            newPrice: null,
            stockQuantity: 0,
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Thêm biến thể
      </Button>
    </div>
  );
};
