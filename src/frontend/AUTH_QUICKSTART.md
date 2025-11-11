# ⚡ Quick Start - Authentication

## 🎯 Tóm tắt nhanh

Hệ thống auth đã được setup đầy đủ với Next.js App Router!

## 🚀 Chạy ngay

```bash
cd src/frontend
npm run dev
```

➡️ Mở: http://localhost:3000 (hoặc port hiển thị trong console)

## 📍 Các trang có sẵn

| Route | Mô tả | Protected |
|-------|-------|-----------|
| `/` | Homepage với auth status | ❌ |
| `/login` | Trang đăng nhập | ❌ |
| `/register` | Trang đăng ký | ❌ |
| `/profile` | Hồ sơ người dùng | ✅ |

## 🔧 Backend cần có

Đảm bảo backend đang chạy với 3 endpoints:

```bash
POST /api/auth/login       # { email, password } → { token, user }
POST /api/auth/register    # { email, password, name } → { token, user }
GET  /api/auth/me          # Header: Bearer <token> → user object
```

URL backend mặc định: `http://localhost:3001/api`  
Thay đổi trong file `.env.local`:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

## ✅ Test thử

### 1. Test không đăng nhập
- Vào http://localhost:3000
- Thấy nút "Đăng nhập" và "Đăng ký" ở góc phải

### 2. Test đăng ký
- Click "Đăng ký" hoặc vào `/register`
- Điền form: tên, email, password
- Submit → tự động đăng nhập và chuyển đến `/profile`

### 3. Test đăng nhập
- Click "Đăng nhập" hoặc vào `/login`
- Điền email/password
- Submit → chuyển đến `/profile`

### 4. Test protected route
- Logout (nếu đang đăng nhập)
- Thử truy cập `/profile` trực tiếp
- → Tự động redirect về `/login`

### 5. Test logout
- Đăng nhập vào
- Click "Đăng xuất" ở góc phải hoặc trong trang profile
- → Token bị xóa, quay về homepage

## 📦 Files đã tạo

```
src/frontend/
├── .env.local                          # Config backend URL
├── AUTH_GUIDE.md                       # Hướng dẫn chi tiết
├── src/
│   ├── lib/
│   │   └── api-client.ts              # ✨ API helpers
│   ├── context/
│   │   ├── auth-context.tsx           # ✨ Auth logic
│   │   └── providers.tsx              # ✨ Wrapper
│   ├── components/
│   │   └── auth/
│   │       ├── RequireAuth.tsx        # ✨ Protected wrapper
│   │       └── AuthStatus.tsx         # ✨ Auth UI component
│   └── app/
│       ├── layout.tsx                 # ✨ Updated (Providers)
│       ├── page.tsx                   # ✨ Updated (AuthStatus)
│       ├── login/page.tsx             # ✨ Login page
│       ├── register/page.tsx          # ✨ Register page
│       └── profile/page.tsx           # ✨ Protected profile
```

## 🎨 Sử dụng trong code

### Hook useAuth

```tsx
import { useAuth } from "@/context/auth-context";

const { user, token, login, register, logout } = useAuth();
```

### Bảo vệ component

```tsx
import RequireAuth from "@/components/auth/RequireAuth";

export default function MyPage() {
  return (
    <RequireAuth>
      <div>Protected content</div>
    </RequireAuth>
  );
}
```

## 📚 Đọc thêm

Chi tiết đầy đủ: [AUTH_GUIDE.md](./AUTH_GUIDE.md)

---

**Status:** ✅ Ready to use  
**Last updated:** 11/11/2025
