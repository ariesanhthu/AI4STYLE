'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BannerSlide } from '@/components/home/BannerSlide';
import { ProductGrid } from '@/components/home/ProductGrid';
import { ChatbotFAB } from '@/components/home/ChatbotFAB';
import { Product } from '@/components/home/ProductCard';

// Mock data for Best Seller products
const bestSellerProducts: Product[] = [
  { id: '1', name: 'Classic White T-Shirt', price: 29.99, image: '/product-1.jpg', category: 'T-Shirts', rating: 4.8 },
  { id: '2', name: 'Denim Jacket Premium', price: 89.99, image: '/product-2.jpg', category: 'Jackets', rating: 4.9 },
  { id: '3', name: 'Black Skinny Jeans', price: 59.99, image: '/product-3.jpg', category: 'Jeans', rating: 4.7 },
  { id: '4', name: 'Summer Floral Dress', price: 69.99, image: '/product-4.jpg', category: 'Dresses', rating: 4.6 },
];

// Mock data for New products
const newProducts: Product[] = [
  { id: '5', name: 'Oversized Hoodie Gray', price: 49.99, image: '/product-5.jpg', category: 'Hoodies', rating: 4.5 },
  { id: '6', name: 'Leather Ankle Boots', price: 129.99, image: '/product-6.jpg', category: 'Shoes', rating: 4.8 },
  { id: '7', name: 'Striped Casual Shirt', price: 39.99, image: '/product-7.jpg', category: 'Shirts', rating: 4.4 },
  { id: '8', name: 'High-Waist Trousers', price: 54.99, image: '/product-8.jpg', category: 'Trousers', rating: 4.7 },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Navbar */}
      <Header />

      {/* Banner Slide Section */}
      <BannerSlide />

      {/* Best Seller Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Best Seller
          </h2>
          <ProductGrid products={bestSellerProducts} />
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            New
          </h2>
          <ProductGrid products={newProducts} />
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chatbot FAB */}
      <ChatbotFAB />
    </div>
  );
}
