import { Product } from "../../user-product/types/product";
import { productService } from "../../user-product/services/product.service";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  avatar?: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Nguyễn Văn A",
    rating: 5,
    comment: "Sản phẩm rất đẹp, chất lượng tốt.",
    createdAt: new Date().toISOString(),
    avatar: "/no-image.png",
  },
  {
    id: "2",
    userId: "u2",
    userName: "Trần Thị B",
    rating: 4,
    comment: "Giao hàng nhanh, đóng gói cẩn thận.",
    createdAt: new Date().toISOString(),
  },
];

export const productDetailsService = {
  getProduct: async (slug: string): Promise<Product | null> => {
    return productService.getProductBySlug(slug);
  },

  getProductById: async (id: string): Promise<Product | null> => {
    return productService.getProductById(id);
  },

  getReviews: async (): Promise<Review[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockReviews;
  },

  getRelatedProducts: async (): Promise<Product[]> => {
    // Use best sellers as related products for now
    try {
      const products = await productService.getBestSellers();
      return products.slice(0, 4);
    } catch (error) {
      console.error("Error fetching related products", error);
      return [];
    }
  },
};
