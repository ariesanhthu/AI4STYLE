# Theme Configuration Guide

## Thay đổi màu chủ đạo của website

Tất cả màu sắc của website đều được quản lý tập trung trong file `src/app/globals.css` thông qua các CSS variables. Để thay đổi theme, bạn chỉ cần sửa 5 biến sau:

### 📍 Vị trí: `src/app/globals.css`

```css
:root {
  /* Brand Colors - Easy to change theme */
  --brand-from: oklch(0.78 0.15 80); /* Màu bắt đầu gradient (hiện tại: vàng) */
  --brand-to: oklch(0.65 0.18 50);   /* Màu kết thúc gradient (hiện tại: cam) */
  --brand-light: oklch(0.97 0.02 75); /* Màu nền nhạt (hiện tại: vàng nhạt) */
  --brand-medium: oklch(0.94 0.03 70); /* Màu viền/border (hiện tại: cam nhạt) */
  --brand-hover: oklch(0.6 0.19 45);  /* Màu hover (hiện tại: cam đậm) */
}
```

## 🎨 Ví dụ Theme

### Theme hiện tại: Vàng-Cam (Yellow-Orange)
```css
--brand-from: oklch(0.78 0.15 80);  /* yellow-500 */
--brand-to: oklch(0.65 0.18 50);    /* orange-600 */
--brand-light: oklch(0.97 0.02 75); /* yellow-50 */
--brand-medium: oklch(0.94 0.03 70); /* orange-100 */
--brand-hover: oklch(0.6 0.19 45);  /* orange-700 */
```

### Theme Tím-Hồng (Purple-Pink)
```css
--brand-from: oklch(0.66 0.25 310);  /* purple-600 */
--brand-to: oklch(0.70 0.27 350);    /* pink-600 */
--brand-light: oklch(0.97 0.02 320); /* purple-50 */
--brand-medium: oklch(0.95 0.03 330); /* purple-100 */
--brand-hover: oklch(0.60 0.26 305);  /* purple-700 */
```

### Theme Xanh Dương (Blue)
```css
--brand-from: oklch(0.60 0.20 240);  /* blue-600 */
--brand-to: oklch(0.55 0.22 230);    /* blue-700 */
--brand-light: oklch(0.97 0.02 245); /* blue-50 */
--brand-medium: oklch(0.94 0.03 242); /* blue-100 */
--brand-hover: oklch(0.50 0.23 225);  /* blue-800 */
```

### Theme Xanh Lá (Green)
```css
--brand-from: oklch(0.65 0.18 140);  /* green-500 */
--brand-to: oklch(0.60 0.20 135);    /* green-600 */
--brand-light: oklch(0.97 0.02 145); /* green-50 */
--brand-medium: oklch(0.94 0.03 142); /* green-100 */
--brand-hover: oklch(0.55 0.21 130);  /* green-700 */
```

### Theme Đỏ (Red)
```css
--brand-from: oklch(0.65 0.24 25);   /* red-500 */
--brand-to: oklch(0.60 0.26 20);     /* red-600 */
--brand-light: oklch(0.97 0.02 30);  /* red-50 */
--brand-medium: oklch(0.94 0.03 28); /* red-100 */
--brand-hover: oklch(0.55 0.27 18);  /* red-700 */
```

## 📝 Hiểu về OKLCH Color Space

OKLCH format: `oklch(L C H)`
- **L** (Lightness): 0-1, độ sáng (0 = đen, 1 = trắng)
- **C** (Chroma): 0-0.4, độ bão hòa màu
- **H** (Hue): 0-360, màu sắc
  - 0-60: Đỏ → Cam
  - 60-120: Vàng → Xanh lá  
  - 120-180: Xanh lá
  - 180-240: Cyan → Xanh dương
  - 240-300: Xanh dương → Tím
  - 300-360: Tím → Hồng → Đỏ

## 🚀 Cách sử dụng trong code

Sau khi config xong, sử dụng các class sau trong components:

### Gradients
```tsx
className="bg-gradient-to-r from-brand-from to-brand-to"
className="text-brand-from" // Màu text
```

### Backgrounds
```tsx
className="bg-brand-light"  // Background nhạt
className="bg-brand-to"     // Background đậm
```

### Borders
```tsx
className="border-brand-medium"
```

### Hover states
```tsx
className="hover:text-brand-to"
className="hover:text-brand-hover"
className="hover:bg-brand-light"
```

### Focus/Ring
```tsx
className="focus:ring-brand-to"
```

## 📁 Files đã áp dụng Brand Colors

- ✅ `src/app/globals.css` - Theme variables
- ✅ `src/app/page.tsx` - Homepage
- ✅ `src/app/profile/page.tsx` - Profile page
- ✅ `src/components/layout/Header.tsx`
- ✅ `src/components/layout/Footer.tsx`
- ✅ `src/components/layout/ProfileHeader.tsx`
- ✅ `src/components/home/BannerSlide.tsx`
- ✅ `src/components/home/ProductCard.tsx`
- ✅ `src/components/home/ChatbotFAB.tsx`
- ✅ `src/components/auth/AuthLayout.tsx`

## 🔧 Troubleshooting

Nếu màu không thay đổi sau khi sửa CSS:
1. Clear browser cache (Ctrl+Shift+R hoặc Cmd+Shift+R)
2. Restart dev server
3. Check lại syntax CSS (đảm bảo có dấu `;` cuối mỗi dòng)
