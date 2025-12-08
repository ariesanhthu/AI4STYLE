"use client";

import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

const formatVND = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: [number, number];
  onValueCommit?: (values: number[]) => void;
  className?: string;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  min = 0,
  max = 10000000, // 10 million VND default
  step = 100000, // 100k step
  defaultValue = [0, 10000000],
  onValueCommit,
  className,
}) => {
  const [localValues, setLocalValues] = useState(defaultValue);

  const handleValueChange = (newValues: number[]) => {
    setLocalValues(newValues as [number, number]);
  };

  return (
    <div className={`w-full max-w-xs space-y-4 ${className}`}>
      {/* Top Section: Labels */}
      <div className="flex justify-between items-center text-sm font-medium text-gray-700">
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500">Min</span>
          <span>{formatVND(localValues[0])}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500">Max</span>
          <span>{formatVND(localValues[1])}</span>
        </div>
      </div>

      {/* Slider Component */}
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={localValues}
        max={max}
        min={min}
        step={step}
        minStepsBetweenThumbs={1}
        onValueChange={handleValueChange}
        onValueCommit={onValueCommit} // Triggers when user stops dragging (good for API calls)
      >
        {/* The Track (Background line) */}
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[3px]">
          {/* The Range (Filled line between thumbs) */}
          <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
        </Slider.Track>

        {/* Thumb 1 (Min) */}
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-[10px] hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-transform active:scale-110 cursor-grab active:cursor-grabbing"
          aria-label="Minimum Price"
        />

        {/* Thumb 2 (Max) */}
        <Slider.Thumb
          className="block w-5 h-5 bg-white border-2 border-blue-600 shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-[10px] hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-transform active:scale-110 cursor-grab active:cursor-grabbing"
          aria-label="Maximum Price"
        />
      </Slider.Root>
    </div>
  );
};

export default PriceRangeSlider;
