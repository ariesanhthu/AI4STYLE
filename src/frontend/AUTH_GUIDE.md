# 🔐 Hướng dẫn Authentication System - AI4STYLE

Hệ thống xác thực frontend sử dụng Next.js App Router, Context API, và JWT token.

## 📋 Tổng quan

Hệ thống auth này bao gồm:
- ✅ Login page (`/login`)
- ✅ Register page (`/register`)
- ✅ Protected routes (ví dụ: `/profile`)
- ✅ Auth Context với hooks
- ✅ Token persistence (localStorage)
- ✅ Auto redirect khi chưa đăng nhập

## 🚀 Cách chạy

### 1. Cài đặt dependencies (nếu chưa)

```bash
cd src/frontend
npm install
```

### 2. Cấu hình backend API URL

Tạo file `.env.local` (đã có sẵn):

```bash
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

Thay đổi URL này phù hợp với backend server của bạn.

### 3. Chạy dev server

```bash
npm run dev
```

App sẽ chạy tại: http://localhost:3000 (hoặc port khác nếu 3000 đang bận)

## 📁 Cấu trúc files

```
src/frontend/src/
├── lib/
│   └── api-client.ts          # API helpers (apiPost, apiGet)
├── context/
│   ├── auth-context.tsx       # AuthProvider & useAuth hook
│   └── providers.tsx          # Client wrapper
├── components/
│   └── auth/
│       └── RequireAuth.tsx    # Protected route wrapper
└── app/
    ├── layout.tsx             # Root layout (có Providers)
    ├── login/
    │   └── page.tsx          # Trang đăng nhập
    ├── register/
    │   └── page.tsx          # Trang đăng ký
    └── profile/
        └── page.tsx          # Trang profile (protected)
```

## 🔌 Backend API Requirements

Backend cần implement các endpoints sau:

### 1. **POST** `/auth/login`
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (success):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "Nguyễn Văn A"
  }
}
```

### 2. **POST** `/auth/register`
Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyễn Văn A"
}
```

Response: tương tự login (token + user)

### 3. **GET** `/auth/me`
Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "Nguyễn Văn A"
}
```

## 💻 Cách sử dụng trong code

### 1. Dùng auth hook trong component

```tsx
"use client";
import { useAuth } from "@/context/auth-context";

export default function MyComponent() {
  const { user, token, login, logout } = useAuth();

  if (!user) return <div>Chưa đăng nhập</div>;

  return (
    <div>
      <h1>Xin chào, {user.name}!</h1>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  );
}
```

### 2. Bảo vệ route (protected page)

```tsx
"use client";
import RequireAuth from "@/components/auth/RequireAuth";

export default function ProtectedPage() {
  return (
    <RequireAuth>
      <div>Nội dung chỉ user đã login mới xem được</div>
    </RequireAuth>
  );
}
```

### 3. Login programmatically

```tsx
const { login } = useAuth();

const handleLogin = async () => {
  const result = await login("email@example.com", "password");
  if (result.ok) {
    console.log("Login thành công!");
  } else {
    console.error("Lỗi:", result.error);
  }
};
```

## 🧪 Test flows

### Test 1: Login thành công
1. Mở http://localhost:3000/login
2. Nhập email/password đúng
3. Nhấn "Đăng nhập"
4. ➡️ Redirect tới `/profile`
5. ✅ Thấy thông tin user

### Test 2: Login thất bại
1. Nhập email/password sai
2. ➡️ Thấy thông báo lỗi màu đỏ
3. ✅ Không redirect, vẫn ở trang login

### Test 3: Protected route
1. Logout (hoặc chưa login)
2. Truy cập trực tiếp http://localhost:3000/profile
3. ➡️ Tự động redirect về `/login`

### Test 4: Register
1. Mở http://localhost:3000/register
2. Điền form đầy đủ
3. ➡️ Tự động login và redirect tới `/profile`

## 🔒 Security Notes

### Hiện tại (MVP):
- ✅ Token lưu trong `localStorage`
- ✅ Client-side redirect
- ⚠️ XSS có thể lấy token từ localStorage

### Cải tiến cho production:

#### 1. **httpOnly Cookies** (khuyến nghị)
```typescript
// Backend set cookie thay vì trả token trong response
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});
```

Frontend không cần localStorage, cookie tự động gửi kèm request.

#### 2. **Refresh Token**
```typescript
// Backend endpoints
POST /auth/refresh
GET /auth/logout (blacklist refresh token)
```

Flow:
- Access token (short-lived: 15 phút)
- Refresh token (long-lived: 7 ngày, httpOnly cookie)
- Auto refresh khi access token hết hạn

#### 3. **CSRF Protection**
Khi dùng cookies, thêm CSRF token:
```typescript
// Backend gửi CSRF token
res.cookie('csrf_token', csrfToken);

// Frontend gửi trong header
headers: { 'X-CSRF-Token': getCsrfToken() }
```

#### 4. **Rate Limiting**
Backend thêm rate limit cho `/auth/login` để chống brute force.

## 🎨 UI Customization

Các pages sử dụng components từ `@/components/ui`:
- `Button`
- `Input`
- `Card`
- `Label`

Tùy chỉnh styles trong `tailwind.config` hoặc `globals.css`.

## 📝 Thêm features

### 1. Forgot Password
Tạo `/forgot-password/page.tsx`:
```tsx
const { data } = await apiPost("/auth/forgot-password", { email });
```

### 2. Email Verification
Sau register, backend gửi email với link:
```
/verify-email?token=xxx
```

### 3. OAuth (Google, Facebook)
Dùng NextAuth.js hoặc tích hợp OAuth flow custom.

### 4. Role-based Access
```tsx
const { user } = useAuth();
if (user.role !== 'admin') return <div>Forbidden</div>;
```

## 🐛 Troubleshooting

### Lỗi: "useAuth must be used within AuthProvider"
➡️ Đảm bảo component được wrap bởi `<Providers>` trong `layout.tsx`.

### Lỗi: Network error / CORS
➡️ Backend cần enable CORS:
```typescript
// NestJS example
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true
});
```

### Token không persist sau refresh
➡️ Kiểm tra localStorage trong DevTools (Application tab).

### Redirect loop
➡️ Kiểm tra logic trong `RequireAuth` và endpoint `/auth/me`.

## 📚 Tài liệu tham khảo

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context API](https://react.dev/reference/react/useContext)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## ✅ Checklist hoàn thành

- [x] API client với error handling
- [x] Auth Context + useAuth hook
- [x] Login page với validation
- [x] Register page
- [x] Protected routes
- [x] Token persistence
- [x] Auto redirect
- [x] Logout functionality
- [x] User profile display
- [ ] Refresh token (future)
- [ ] httpOnly cookies (future)
- [ ] Email verification (future)
- [ ] OAuth integration (future)

---

**Tác giả:** AI4STYLE Team  
**Ngày cập nhật:** 11/11/2025
