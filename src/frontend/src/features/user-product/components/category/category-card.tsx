"use client";

import * as RootCard from "@/components/ui/card";
import * as RootButton from "@/components/ui/button";
import type { Category } from "../../types/category";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const handleOnClick = () => {
    console.log(`Category ${category.name} clicked`);
  };

  return (
    <RootCard.Card>
      <RootCard.CardHeader>
        <RootCard.CardTitle>{category.name}</RootCard.CardTitle>
        <RootButton.Button onClick={handleOnClick}>Click Me</RootButton.Button>
      </RootCard.CardHeader>
    </RootCard.Card>
  );
};

export default CategoryCard;
