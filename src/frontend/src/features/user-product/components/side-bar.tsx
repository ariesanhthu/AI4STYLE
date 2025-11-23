"use client";

import { Sidebar } from "lucide-react";

interface ProductsSideBarProps {
  className?: string;
}

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
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
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
        <li className="font-bold">Size</li>
        <div className="flex flex-row justify-around ml-4 gap-4 list-disc">
          <div className="hover:font-extrabold">Small</div>
          <div className="hover:font-extrabold">Medium</div>
          <div className="hover:font-extrabold">Large</div>
        </div>
        <div className="my-2">
          <hr />
        </div>
        <li className="font-bold">Price Range</li>
        <div className="flex flex-col justify-around ml-4 gap-4 list-disc">
          <div className="hover:font-extrabold">$0 - $50</div>
          <div className="hover:font-extrabold">$51 - $100</div>
          <div className="hover:font-extrabold">$101 - $200</div>
        </div>
      </ul>
    </div>
  );
};
