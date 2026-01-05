import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Khoảng giá</h3>
      <Slider
        min={min}
        max={max}
        step={10000}
        value={localValue}
        onValueChange={(val) => setLocalValue(val as [number, number])}
        onValueCommit={(val) => onChange(val as [number, number])}
        className="py-4"
        minStepsBetweenThumbs={1}
      />
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(localValue[0])}
        </span>
        <span>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
          }).format(localValue[1])}
        </span>
      </div>
    </div>
  );
}
