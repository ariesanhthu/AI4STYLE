"use client";

import { Sidebar } from "lucide-react";
import CategorySection from "../category/category-section";
import PriceRangeSlider from "./price-scroller";

interface ProductsSideBarProps {
  className?: string;
}

const MAX_PRICE = 10000000;
const MIN_PRICE = 0;

export const ProductsSideBar = ({ className }: ProductsSideBarProps) => {
  return (
    <div className={className + "w-64 h-screen border-r p-4"}>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Sidebar className="mr-2" /> Search
      </h2>
      <input
        type="text"
        placeholder="Search products..."
        className="w-full p-2 border rounded mb-8"
      />

      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Sidebar className="mr-2" /> Filters
      </h2>
      <CategorySection />
      <ul className="space-y-2">
        <hr />
        <li className="font-bold">Color</li>
        <div className="flex flex-row justify-around ml-4 gap-4 list-disc">
          <div className="hover:font-extrabold">Red</div>
          <div className="hover:font-extrabold">Blue</div>
          <div className="hover:font-extrabold">Green</div>
        </div>
        <div className="my-2">
          <hr />
        </div>

        <li className="font-bold">Price Range</li>
        <PriceRangeSlider
          min={MIN_PRICE}
          max={MAX_PRICE}
          onValueCommit={(values) => {
            console.log("Price changed", values);
          }}
        />
      </ul>
    </div>
  );
};
