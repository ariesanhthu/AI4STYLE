import { Product } from "../types/product";

export const mockProducts: Product[] = [
  {
    id: "p001",
    name: "Classic Leather Jacket",
    brand: "UrbanWear",
    description:
      "A timeless black leather jacket with a slim fit and durable finish.",
    price: 149.99,
    originalPrice: 199.99,
    imageUrl: "/assets/img.png",
    images: [
      {
        url: "/assets/img/products/leather-jacket-front.jpg",
        alt: "Front view of leather jacket",
      },
      {
        url: "/assets/img/products/leather-jacket-back.jpg",
        alt: "Back view of leather jacket",
      },
      {
        url: "/assets/img/products/leather-jacket-closeup.jpg",
        alt: "Close-up of leather texture",
      },
    ],
    sizes: [
      { value: "S", label: "Small", available: true },
      { value: "M", label: "Medium", available: true },
      { value: "L", label: "Large", available: false },
    ],
    colors: [
      { name: "Black", value: "#000000", available: true },
      { name: "Brown", value: "#5C4033", available: true },
    ],
    fabric: "100% Genuine Leather",
    care: [
      "Do not machine wash",
      "Wipe with damp cloth",
      "Store in cool dry place",
    ],
    features: ["Slim fit", "Durable zippers", "Inner lining for comfort"],
    stock: 12,
    rating: 4.7,
    reviewCount: 158,
    category: "Jackets",
    tags: ["leather", "outerwear", "men"],
    createdAt: "2025-10-10T09:00:00Z",
    updatedAt: "2025-11-05T15:30:00Z",
  },
  {
    id: "p002",
    name: "Cotton Oversized T-Shirt",
    brand: "CasualCore",
    description: "Soft cotton T-shirt with oversized fit for maximum comfort.",
    price: 29.99,
    originalPrice: 39.99,
    imageUrl: "/assets/img.png",
    images: [
      {
        url: "/assets/img/products/tshirt-white.jpg",
        alt: "White oversized T-shirt front view",
      },
      {
        url: "/assets/img/products/tshirt-black.jpg",
        alt: "Black oversized T-shirt front view",
      },
    ],
    sizes: [
      { value: "S", label: "Small", available: true },
      { value: "M", label: "Medium", available: true },
      { value: "L", label: "Large", available: true },
      { value: "XL", label: "Extra Large", available: true },
    ],
    colors: [
      { name: "White", value: "#FFFFFF", available: true },
      { name: "Black", value: "#000000", available: true },
      { name: "Beige", value: "#F5F5DC", available: true },
    ],
    fabric: "100% Organic Cotton",
    care: ["Machine wash cold", "Tumble dry low", "Do not bleach"],
    features: ["Oversized fit", "Breathable cotton", "Soft-touch fabric"],
    stock: 48,
    rating: 4.5,
    reviewCount: 92,
    category: "Tops",
    tags: ["t-shirt", "casual", "unisex"],
    createdAt: "2025-10-15T12:00:00Z",
    updatedAt: "2025-11-06T10:00:00Z",
  },
  {
    id: "p003",
    name: "Denim Skinny Jeans",
    brand: "BlueThread",
    description: "Stretch-fit denim jeans designed for both comfort and style.",
    price: 59.99,
    originalPrice: 89.99,
    imageUrl: "/assets/img.png",
    images: [
      {
        url: "/assets/img/products/jeans-front.jpg",
        alt: "Front view of denim jeans",
      },
      {
        url: "/assets/img/products/jeans-back.jpg",
        alt: "Back view of denim jeans",
      },
    ],
    sizes: [
      { value: "28", label: "28", available: true },
      { value: "30", label: "30", available: true },
      { value: "32", label: "32", available: false },
    ],
    colors: [
      { name: "Indigo", value: "#264348", available: true },
      { name: "Washed Blue", value: "#4F6D7A", available: true },
    ],
    fabric: "98% Cotton, 2% Spandex",
    care: ["Machine wash cold", "Do not tumble dry", "Iron low"],
    features: ["Slim fit", "Stretch material", "Five-pocket design"],
    stock: 35,
    rating: 4.3,
    reviewCount: 76,
    category: "Jeans",
    tags: ["denim", "bottoms", "men"],
    createdAt: "2025-09-30T08:00:00Z",
    updatedAt: "2025-11-07T14:15:00Z",
  },
];
