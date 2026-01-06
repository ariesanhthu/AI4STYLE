"use client";

import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { VariantList } from "./VariantList";
import { ImageSelectDialog } from "../../admin-images/components/image-select-dialog";

import { ProductFormValues } from "../types/schema";

export const OptionList: React.FC = () => {
  const { control } = useFormContext<ProductFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "product.options",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tùy chọn</h3>
      </div>

      {fields.map((field, index) => (
        <OptionItem key={field.id} index={index} remove={remove} />
      ))}

      <Button
        type="button"
        variant="outline"
        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 h-16 border-dashed"
        onClick={() =>
          append({
            name: "",
            images: [],
            colorFamily: "",
            variants: [],
          })
        }
      >
        <Plus className="mr-2 h-6 w-6" /> Thêm tùy chọn
      </Button>
    </div>
  );
};

interface OptionItemProps {
  index: number;
  remove: (index: number) => void;
}

const OptionItem: React.FC<OptionItemProps> = ({ index, remove }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
  const { control, watch, register } = useFormContext<ProductFormValues>();

  // Watch values for the header summary
  const name = watch(`product.options.${index}.name`);
  const colorFamily = watch(`product.options.${index}.colorFamily`);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border border-blue-200 rounded-lg overflow-hidden"
    >
      {/* CRITICAL: Hidden input to preserve optionId for existing options */}
      <input
        type="hidden"
        {...register(`product.options.${index}.optionId`)}
      />
      <div className="flex items-center justify-between p-4 border-b border-blue-100">
        <div className="flex items-center gap-4 flex-1">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <div className="flex gap-2 text-sm font-medium text-variant">
            <span>{name || "Tùy chọn mới"}</span>|
            {colorFamily && <span className="text-blue-500"> {colorFamily}</span>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-50"
          onClick={() => remove(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <CollapsibleContent className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`product.options.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên tùy chọn</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Ví dụ: Đỏ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`product.options.${index}.colorFamily`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhóm màu</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} placeholder="Ví dụ: Đỏ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`product.options.${index}.images`}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Hình ảnh</FormLabel>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(field.value || []).map((url: string, imgIndex: number) => (
                      <div key={imgIndex} className="relative group aspect-square rounded-md overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Option ${imgIndex}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...(field.value || [])];
                            newImages.splice(imgIndex, 1);
                            field.onChange(newImages);
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="aspect-square flex flex-col items-center justify-center gap-2 border-dashed h-full w-full bg-slate-50 hover:bg-slate-100"
                      onClick={() => setIsImageDialogOpen(true)}
                    >
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Thêm hình ảnh</span>
                    </Button>
                  </div>
                  <FormMessage />
                </div>

                <ImageSelectDialog
                  open={isImageDialogOpen}
                  onOpenChange={setIsImageDialogOpen}
                  onSelect={(urls) => {
                    // Append new unique URLs to existing ones
                    const currentUrls = new Set(field.value || []);
                    urls.forEach(url => currentUrls.add(url));
                    field.onChange(Array.from(currentUrls));
                  }}
                  multiple={true}
                />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t pt-4">
          <VariantList variantIndex={index} />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
