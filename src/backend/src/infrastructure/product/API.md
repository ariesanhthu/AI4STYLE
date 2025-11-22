# Product Module API Documentation

## Overview
The Product module provides complete CRUD operations for managing products with a three-tier hierarchy:
- **Product** (root) → **ProductOption** (color variants) → **ProductVariant** (size + SKU + inventory)

---

## Client Endpoints

### 1. Get Product by ID
**GET** `/client/product/:id`

Query Parameters:
- `includeOptions` (boolean, optional, default: true) - Include product options
- `includeVariants` (boolean, optional, default: true) - Include product variants

Example: `GET /client/product/123?includeOptions=true&includeVariants=false`

---

### 2. Get All Product Options
**GET** `/client/product/options`

Query Parameters:
- `cursor` (string, optional) - Cursor for pagination
- `limit` (number, optional, default: 10) - Items per page
- `sortOrder` (enum: ASC|DESC, optional, default: DESC) - Sort order
- `categoryId` (string, optional) - Filter by category ID
- `isShow` (boolean, optional) - Filter by visibility
- `colorFamily` (string, optional) - Filter by color family
- `minPrice` (number, optional) - Minimum price filter
- `maxPrice` (number, optional) - Maximum price filter
- `search` (string, optional) - Search by product name

Example: `GET /client/product/options?categoryId=123&minPrice=10000&maxPrice=50000&colorFamily=blue`

---

### 3. Get Product Option by ID
**GET** `/client/product/options/:id`

Returns a single product option with all variants.

---

## Admin Endpoints

### 1. Get All Products
**GET** `/admin/product`

Query Parameters: Same as "Get All Product Options" (above)

Requires: `PRODUCT_MANAGEMENT` permission

---

### 2. Get Product by ID
**GET** `/admin/product/:id`

Query Parameters:
- `includeOptions` (boolean, optional, default: true)
- `includeVariants` (boolean, optional, default: true)

Requires: `PRODUCT_MANAGEMENT` permission

---

### 3. Create Product
**POST** `/admin/product`

Request Body:
```json
{
  "categoryId": "uuid",
  "name": "Product Name",
  "description": "Product description (optional)",
  "options": [
    {
      "name": "Option Name (e.g., Red)",
      "color": "#FF0000",
      "colorFamily": "red",
      "thumbnail": "https://...",
      "images": ["https://...", "https://..."],
      "isShow": true,
      "variants": [
        {
          "sku": "SKU-001",
          "size": "M",
          "price": 100000,
          "newPrice": 80000,
          "stockQuantity": 50
        }
      ]
    }
  ]
}
```

Requires: `PRODUCT_MANAGEMENT` permission

---

### 4. Update Product
**PATCH** `/admin/product/:id`

Request Body:
```json
{
  "categoryId": "uuid (optional)",
  "name": "Updated Name (optional)",
  "description": "Updated description (optional)",
  "options": [
    {
      "optionId": "uuid",
      "name": "Updated Option Name (optional)",
      "color": "#FF0000 (optional)",
      "colorFamily": "red (optional)",
      "thumbnail": "https://... (optional)",
      "images": ["https://..."] (optional)",
      "isShow": true (optional)
    }
  ],
  "newOptions": [
    {
      "name": "New Option",
      "color": "#00FF00",
      "colorFamily": "green",
      "thumbnail": "https://...",
      "images": ["https://..."],
      "isShow": true,
      "variants": [
        {
          "sku": "SKU-002",
          "size": "L",
          "price": 120000,
          "newPrice": null,
          "stockQuantity": 30
        }
      ]
    }
  ],
  "deleteOptionIds": ["uuid1", "uuid2"]
}
```

Requires: `PRODUCT_MANAGEMENT` permission

---

### 5. Update Product Stock and Price
**PATCH** `/admin/product/:id/inventory`

Request Body:
```json
{
  "variants": [
    {
      "variantId": "uuid",
      "price": 110000,
      "newPrice": 90000,
      "stockQuantity": 100
    },
    {
      "variantId": "uuid2",
      "stockQuantity": 50
    }
  ]
}
```

This endpoint:
- Updates variant prices and stock quantities in bulk
- Automatically recalculates denormalized fields (min price, out of stock status) for affected options
- Only updates fields that are provided

Requires: `PRODUCT_MANAGEMENT` permission

---

### 6. Delete Product
**DELETE** `/admin/product/:id`

Deletes the product and all associated options and variants (cascade).

Requires: `PRODUCT_MANAGEMENT` permission

---

## Features

### Denormalized Fields
ProductOption includes denormalized fields for performance:
- `price` - Minimum price from all variants
- `new_price` - Minimum sale price from all variants (if any)
- `out_of_stock` - True if all variants are out of stock

These are automatically calculated and synced when variants are created/updated.

### Slug Generation
- Product option slugs are auto-generated from names
- Search strings are normalized for case-insensitive searching

### Thumbnail Management
- Product thumbnail is automatically extracted from the first option's first image
- Updated when options are added/modified

### Bulk Operations
- Create multiple options with variants in a single request
- Update multiple variants in a single request
- Efficient database operations using bulk inserts/updates
