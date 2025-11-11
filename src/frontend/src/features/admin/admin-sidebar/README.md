# Admin Sidebar Feature

This feature module contains all components, hooks, and services related to the admin sidebar functionality.

## Structure

```
admin-sidebar/
├── components/          # UI components
│   └── sidebar-footer.tsx
├── hooks/              # Custom React hooks
│   └── use-admin-auth.ts
├── services/           # API services
│   └── admin-auth.service.ts
├── types/              # TypeScript types
│   └── user.type.ts
└── index.ts            # Public exports
```

## Usage

### Using the Hook

```tsx
import { useAdminAuth } from "@/features/admin/admin-sidebar";

function MyComponent() {
  const { user, isLoading, isError, logout, updateProfile } = useAdminAuth();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading user</div>;

  return (
    <div>
      <p>Hello, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using the Service Directly

```tsx
import { adminAuthService } from "@/features/admin/admin-sidebar";

async function fetchUser() {
  try {
    const user = await adminAuthService.getCurrentUser();
    console.log(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}
```

### Using the Components

```tsx
import { AdminSidebarFooter } from "@/features/admin/admin-sidebar";

function AdminLayout() {
  return (
    <aside>
      {/* Other sidebar content */}
      <AdminSidebarFooter />
    </aside>
  );
}
```

## API Service (Mock)

Currently, the service uses **mocked data** since the backend API is not ready yet. The mock includes:

- **Mock user data** with realistic values
- **Simulated network delay** (300-800ms)
- **Random failure simulation** (10% chance) for testing error states

### Mock User Data

```typescript
{
  id: "admin-001",
  email: "admin@ai4style.com",
  name: "John Doe",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  role: "admin"
}
```

### When Backend is Ready

Uncomment the real API calls in `admin-auth.service.ts`:

```typescript
// Real API call:
return apiClient<User>(`${BASE_URL}/api/admin/me`, {
  method: "GET",
  credentials: "include",
});
```

## Features

### useAdminAuth Hook

Returns:
- `user: User | null` - Current authenticated user
- `isLoading: boolean` - Loading state
- `isError: boolean` - Error state
- `error: Error | null` - Error object
- `refetch: () => Promise<void>` - Refetch user data
- `updateProfile: (data) => Promise<void>` - Update user profile
- `logout: () => Promise<void>` - Logout user

### AdminSidebarFooter Component

Features:
- **Loading state** with skeleton
- **Error state** with retry button
- **User info display** with avatar, name, email
- **Logout button**

## Environment Variables

Set in `.env.local`:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Types

```typescript
type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "user" | "admin";
}
```

## Notes

- All API calls are currently mocked with realistic delays
- The hook automatically fetches user data on mount
- Logout redirects to `/admin/login`
- Services can be used directly or through hooks
