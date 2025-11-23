# API Client

Type-safe API client for the AI4STYLE application with automatic token refresh and error handling.

## Features

- ✅ **Type-safe** - Full TypeScript support with auto-generated types from OpenAPI schema
- 🔄 **Automatic token refresh** - Handles access token expiration and refresh
- 🎯 **Role-based routing** - Supports both admin and client endpoints
- 🛡️ **Error handling** - Comprehensive error handling with custom error types
- 🔐 **Secure storage** - Token management with localStorage
- 📦 **Lightweight** - Uses native `fetch` under the hood

## Installation

Required packages:
```bash
npm install openapi-fetch
```

## Basic Usage

### 1. Authentication

```typescript
import { apiClient, tokenManager } from '@/lib/api-client';

// After successful login
function handleLoginSuccess(response: any) {
  tokenManager.setTokens(
    response.accessToken,
    response.refreshToken,
    'admin' // or 'client'
  );
}

// Logout
function handleLogout() {
  tokenManager.clearTokens();
  // Redirect to login page
}

// Check authentication
if (tokenManager.isAuthenticated()) {
  // User is logged in
}
```

### 2. Making API Calls

#### GET Request
```typescript
import { apiClient } from '@/lib/api-client';

// Get product by ID
const { data, error } = await apiClient.GET('/shop/v1/admin/product/{id}', {
  params: {
    path: { id: 'product-123' },
    query: { includeOptions: true, includeVariants: true }
  }
});

if (error) {
  console.error('Failed to fetch product:', error);
  return;
}

console.log('Product:', data);
```

#### POST Request
```typescript
// Create a new product
const { data, error } = await apiClient.POST('/shop/v1/admin/product', {
  body: {
    name: 'New Product',
    description: 'Product description',
    categoryId: 'category-123',
    options: [
      {
        name: 'Color',
        values: ['Red', 'Blue']
      }
    ]
  }
});

if (error) {
  console.error('Failed to create product:', error);
  return;
}

console.log('Created product:', data);
```

#### PATCH Request
```typescript
// Update product
const { data, error } = await apiClient.PATCH('/shop/v1/admin/product/{id}', {
  params: {
    path: { id: 'product-123' }
  },
  body: {
    name: 'Updated Product Name',
    price: 99.99
  }
});
```

#### DELETE Request
```typescript
// Delete product
const { data, error } = await apiClient.DELETE('/shop/v1/admin/product/{id}', {
  params: {
    path: { id: 'product-123' }
  }
});
```

### 3. With Helper Function (Better Error Handling)

```typescript
import { apiClient, apiCall } from '@/lib/api-client';

const { data, error } = await apiCall(
  apiClient.GET('/shop/v1/admin/product', {
    params: {
      query: { page: 1, limit: 10 }
    }
  })
);

if (error) {
  // Handle error
  return;
}

// TypeScript knows data is not null here
console.log(data);
```

### 4. In React Components

#### Admin Component
```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient, tokenManager } from '@/lib/api-client';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await apiClient.GET('/shop/v1/admin/product', {
        params: {
          query: { page: 1, limit: 20 }
        }
      });

      if (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
        return;
      }

      setProducts(data?.items || []);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

#### Client Component
```typescript
'use client';

import { apiClient } from '@/lib/api-client';

export default function ProductPage({ id }: { id: string }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await apiClient.GET('/shop/v1/client/products/options/{id}', {
        params: {
          path: { id }
        }
      });

      setProduct(data);
    }

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return <div>{product.name}</div>;
}
```

### 5. Form Submission

```typescript
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function CreateProductForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    const { data, error } = await apiClient.POST('/shop/v1/admin/product', {
      body: {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        categoryId: formData.get('categoryId') as string,
      }
    });

    setLoading(false);

    if (error) {
      alert('Failed to create product');
      return;
    }

    alert('Product created successfully!');
    // Redirect or update UI
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Product name" required />
      <textarea name="description" placeholder="Description" required />
      <input name="price" type="number" placeholder="Price" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

## Token Refresh Flow

The client automatically handles token refresh:

1. Request is made with access token
2. If access token is expired (401), middleware catches it
3. Refresh token endpoint is called based on user role:
   - Admin: `/shop/v1/admin/auth/refresh-token`
   - Client: `/shop/v1/client/auth/refresh-token`
4. New tokens are stored
5. Original request is retried with new access token
6. If refresh fails, user is redirected to login

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_KEY=your-api-key-here
```

## Error Handling

```typescript
import { apiClient, isApiError } from '@/lib/api-client';

const { data, error } = await apiClient.GET('/some-endpoint');

if (error) {
  if (isApiError(error)) {
    console.log('Status:', error.status);
    console.log('Message:', error.data?.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Type Safety

All endpoints, parameters, and responses are fully typed:

```typescript
// ✅ TypeScript will autocomplete paths
await apiClient.GET('/shop/v1/admin/product/{id}', {
  // ✅ TypeScript will autocomplete params
  params: {
    path: { id: '123' },
    query: { includeOptions: true } // ✅ Only valid query params allowed
  }
});

// ❌ TypeScript error: Invalid path
await apiClient.GET('/invalid/path');

// ❌ TypeScript error: Invalid query param
await apiClient.GET('/shop/v1/admin/product', {
  params: {
    query: { invalidParam: true }
  }
});
```

## Advanced Usage

### Custom Client Instance

```typescript
import { createApiClient } from '@/lib/api-client';

const customClient = createApiClient();

// Use custom client
const { data } = await customClient.GET('/some-endpoint');
```

### Server-Side Usage (Next.js Server Components)

```typescript
import { cookies } from 'next/headers';
import createClient from 'openapi-fetch';
import type { paths } from '@/lib/api-client/open-api';

// Server-side client (no automatic refresh)
export async function getServerClient() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  const client = createClient<paths>({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  client.use({
    onRequest({ request }) {
      if (accessToken) {
        request.headers.set('Authorization', `Bearer ${accessToken}`);
      }
      request.headers.set('x-api-key', process.env.NEXT_PUBLIC_API_KEY || '');
      return request;
    }
  });

  return client;
}

// Usage in Server Component
export default async function ServerPage() {
  const client = await getServerClient();
  const { data } = await client.GET('/shop/v1/admin/product');

  return <div>{/* Render data */}</div>;
}
```
