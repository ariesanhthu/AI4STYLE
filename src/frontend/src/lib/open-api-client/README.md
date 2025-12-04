# Open API Client

This directory contains the customized API client and generated TypeScript types for the application. It provides a type-safe way to interact with the backend API, handling authentication, token refreshing, and error formatting automatically.

## Table of Contents
- [Overview](#overview)
- [Usage](#usage)
  - [Importing the Client](#importing-the-client)
  - [Making Requests](#making-requests)
  - [Handling Responses](#handling-responses)
- [Type Definitions](#type-definitions)
  - [Admin vs Client Types](#admin-vs-client-types)
  - [Best Practices for Types](#best-practices-for-types)
- [Examples](#examples)

## Overview

The `apiClient` is built on top of `openapi-fetch`, providing a lightweight and type-safe fetch client. It includes:
- **Auth Middleware**: Automatically attaches `x-api-key` and `Authorization` (Bearer token) headers. It also handles 401 Unauthorized errors by attempting to refresh the access token and retrying the request.
- **Error Middleware**: Standardizes error responses and logs server/client errors.

## Usage

### Importing the Client

Import the `apiClient` instance from this directory:

```typescript
import { apiClient } from "@/lib/open-api-client";
```

### Making Requests

The client supports standard HTTP methods (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). The paths are fully typed based on the OpenAPI specification.

**Syntax:**

```typescript
const response = await apiClient.METHOD("/path/to/endpoint", {
  params: {
    query: { /* query parameters */ },
    path: { /* path parameters */ },
  },
  body: { /* request body */ },
});
```

### Handling Responses

The response object contains `data`, `error`, and the raw `response`.

- **Success**: `data` will be populated, and `error` will be undefined.
- **Failure**: `error` will be populated.

```typescript
const { data, error } = await apiClient.GET("/some/endpoint");

if (error) {
  // Handle error
  console.error(error);
  return;
}

// Use data
console.log(data);
```

## Type Definitions

We generate TypeScript types from the backend's OpenAPI spec to ensure full type safety. These types are split into two files for better organization:

### Admin vs Client Types

1.  **`type.admin.ts`**: Contains types for Admin-related endpoints (e.g., User Management, Role Management).
2.  **`type.client.ts`**: Contains types for Client-facing endpoints (e.g., Products, Cart, Checkout).

These files export types for:
- **Params**: Path and query parameters.
- **Request**: Request body.
- **Response**: Successful response body.

> **Important Note on Response Types:**
> The backend wraps all successful responses in a standard format:
> ```typescript
> {
>   success: boolean;
>   timestamp: string;
>   code: number;
>   data: T; // The actual data you need
> }
> ```
> Therefore, when you use the generated `Response` types (e.g., `RoleListResponse`), they typically refer to this wrapper object. To access the actual entity data type, you should access the `['data']` property of the response type.
>
> **Example:**
> ```typescript
> // This is the wrapper type
> type ApiWrapper = RoleAdminController_getListRoles_Response;
>
> // This is the actual list of roles
> export type RoleList = RoleAdminController_getListRoles_Response['data'];
> ```

### Best Practices for Types

The generated type names can be quite long and verbose (e.g., `RoleAdminController_getListRoles_Response`). **It is highly recommended to import these types into your feature's `types` folder and alias them to shorter, friendlier names.**

**Example:**

In `src/features/admin/admin-roles/types/role.type.ts`:

```typescript
import { 
  RoleAdminController_getListRoles_Response,
  RoleAdminController_createRole_Request 
} from "@/lib/open-api-client/type.admin";

// Alias to friendly names
export type RoleListResponse = RoleAdminController_getListRoles_Response;
export type CreateRoleRequest = RoleAdminController_createRole_Request;
```

Then, use `RoleListResponse` and `CreateRoleRequest` in your components and hooks.

## Examples

### 1. Fetching Data (GET)

```typescript
import { apiClient } from "@/lib/open-api-client";
import { UserGetListParams } from "../types/user.type"; // Aliased type

const fetchUsers = async (params: UserGetListParams) => {
  const { data, error } = await apiClient.GET("/shop/v1/admin/users", {
    params: {
      query: params, // e.g., { page: 1, limit: 10 }
    },
  });

  if (error) {
    console.error("Failed to fetch users:", error);
    return null;
  }

  return data;
};
```

### 2. Creating Data (POST)

```typescript
import { apiClient } from "@/lib/open-api-client";
import { CreateRoleRequest } from "../types/role.type"; // Aliased type

const createRole = async (newRole: CreateRoleRequest) => {
  const { data, error } = await apiClient.POST("/shop/v1/admin/roles", {
    body: newRole,
  });

  if (error) {
    throw new Error(error.message || "Failed to create role");
  }

  return data;
};
```

### 3. Updating Data (PATCH) with Path Params

```typescript
import { apiClient } from "@/lib/open-api-client";

const updateStatus = async (id: string, status: string) => {
  const { error } = await apiClient.PATCH("/shop/v1/orders/{id}/status", {
    params: {
      path: { id },
    },
    body: { status },
  });

  if (error) {
    // Handle error
  }
};
```
