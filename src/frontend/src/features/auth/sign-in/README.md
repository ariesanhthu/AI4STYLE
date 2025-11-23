# Sign In Feature

Admin sign-in feature for AI4STYLE application.

## Structure

```
sign-in/
├── components/          # UI components
│   ├── sign-in-card.tsx    # Main sign-in card wrapper
│   └── sign-in-form.tsx    # Sign-in form with validation
├── hooks/               # Custom React hooks
│   └── use-sign-in.ts      # Sign-in logic hook
├── services/            # API services
│   └── sign-in.service.ts  # Sign-in API calls
├── types/               # TypeScript types
│   └── sign-in.types.ts    # Sign-in related types
└── index.ts             # Public exports
```

## Usage

### Basic Usage

```tsx
import { SignInCard } from "@/features/auth/sign-in";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInCard />
    </div>
  );
}
```

### Using the Hook Directly

```tsx
import { useSignIn } from "@/features/auth/sign-in";

function MyCustomSignIn() {
  const { signIn, isLoading, error } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn({
      email: "admin@example.com",
      password: "password123",
    });
  };

  // Your custom UI
}
```

## Features

- ✅ Email and password authentication
- ✅ Remember me functionality
- ✅ Loading states
- ✅ Error handling with user feedback
- ✅ Token management (access + refresh tokens)
- ✅ Auto-redirect to /admin on success
- ✅ Type-safe API calls using OpenAPI schema
- ✅ Responsive design

## API Integration

Uses the OpenAPI client to communicate with:
- **Endpoint**: `POST /shop/v1/admin/auth/sign-in`
- **Request Body**: `{ email: string, password: string }`
- **Response**: `{ success: boolean, data: { accessToken: string, refreshToken: string } }`

Tokens are automatically stored in localStorage and used for subsequent API calls.

## Components

### SignInCard
Main wrapper component that includes the form with proper card styling.

### SignInForm  
Form component with:
- Email input (required, type="email")
- Password input (required, type="password")
- Remember me checkbox
- Submit button with loading state
- Error alert display

## Hooks

### useSignIn
Custom hook that handles:
- Form submission
- API calls
- Loading state
- Error handling
- Token storage
- Navigation to /admin on success

## Services

### signInService
Service layer for API calls:
- `signIn(credentials)` - Authenticate user and store tokens
- `signOut()` - Sign out user and clear tokens

## Types

All types are generated from the OpenAPI schema:
- `SignInRequest` - API request payload
- `SignInResponse` - API response structure
- `SignInFormData` - Form state with rememberMe field
