'use client';

import { useState } from "react";
import { SearchBar } from "../../components/search-bar";

export function ProductManagement() {
  const [search, setSearch] = useState("");
  
  const handleSearch = (value: string) => {
    console.log("Debounced search (call API here):", value);
    setSearch(value);
    // fetchProducts(value);
  };

  return (
    <div>
      <h1>Product Management Page</h1>

      <SearchBar 
        placeholder="Search products..."
        debounceDelay={300}
        onChange={(value) => console.log("Typing:", value)}  // Optional: real-time updates
        onSearch={handleSearch}  // Debounced callback
      />

      <p>Searching for: {search}</p>
    </div>
  ) 
}