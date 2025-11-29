import { Category } from "../types/category.type"
import { ListCategoryResponseDto } from "@/lib/open-api-client/type"
import { apiClient } from "@/lib/open-api-client"

const data: Category[] = [
    {
        id: "cat_1",
        icon: "https://github.com/shadcn.png",
        name: "T-Shirt",
        slug: "t-shirt",
    },
    {
        id: "cat_2",
        icon: "https://github.com/shadcn.png",
        name: "Jeans",
        slug: "jeans",
    },
    {
        id: "cat_3",
        icon: "https://github.com/shadcn.png",
        name: "Shoes",
        slug: "shoes",
    },
    {
        id: "cat_4",
        icon: "https://github.com/shadcn.png",
        name: "Accessories",
        slug: "accessories",
    },
    {
        id: "cat_5",
        icon: "https://github.com/shadcn.png",
        name: "Jackets",
        slug: "jackets",
    },
    {
        id: "cat_6",
        icon: "https://github.com/shadcn.png",
        name: "Hats",
        slug: "hats",
    },
    {
        id: "cat_7",
        icon: "https://github.com/shadcn.png",
        name: "Socks",
        slug: "socks",
    },
    {
        id: "cat_8",
        icon: "https://github.com/shadcn.png",
        name: "Belts",
        slug: "belts",
    },
    {
        id: "cat_9",
        icon: "https://github.com/shadcn.png",
        name: "Scarves",
        slug: "scarves",
    },
    {
        id: "cat_10",
        icon: "https://github.com/shadcn.png",
        name: "Gloves",
        slug: "gloves",
    },
    {
        id: "cat_11",
        icon: "https://github.com/shadcn.png",
        name: "Watches",
        slug: "watches",
    },
    {
        id: "cat_12",
        icon: "https://github.com/shadcn.png",
        name: "Glasses",
        slug: "glasses",
    },
    {
        id: "cat_13",
        icon: "https://github.com/shadcn.png",
        name: "Bags",
        slug: "bags",
    },
    {
        id: "cat_14",
        icon: "https://github.com/shadcn.png",
        name: "Wallets",
        slug: "wallets",
    },
    {
        id: "cat_15",
        icon: "https://github.com/shadcn.png",
        name: "Jewelry",
        slug: "jewelry",
    },
]

const categoryService = {
  async getAllCategory(): Promise<ListCategoryResponseDto> {
    const response = await apiClient.GET('/shop/v1/admin/category');
    if (response.error) {
      throw new Error(response.error.message || "Sign in failed");
    }

    if (!response.data) {
      throw new Error("No data received from server");
    }
    return response.data.data;
  }
}

export default categoryService
 