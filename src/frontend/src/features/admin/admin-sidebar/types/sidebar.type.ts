import { Boxes, ChartColumn, LucideProps, Package, Shield, ShoppingCart, Users, Image } from "lucide-react"
import { UserPermission } from "./user.type"

export interface SidebarItem {
  id: number
  title: string
  permission: UserPermission
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  href: string
}


export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: 1,
    title: "Thống kê",
    permission: "DASHBOARD_ACCESS",
    icon: ChartColumn,
    href: "/admin/dashboard"
  },
  {
    id: 2,
    title: "Quản lý danh mục",
    permission: "CATEGORY_MANAGEMENT",
    icon: Boxes,
    href: "/admin/categories"
  },
  {
    id: 3,
    title: "Quản lý sản phẩm",
    permission: "PRODUCT_MANAGEMENT",
    icon: Package,
    href: "/admin/products"
  },
  {
    id: 4,
    title: "Quản lý đơn hàng",
    permission: "ORDER_MANAGEMENT",
    icon: ShoppingCart,
    href: "/admin/orders"
  },
  {
    id: 5,
    title: "Quản lý người dùng",
    permission: "USER_MANAGEMENT",
    icon: Users,
    href: "/admin/users"
  },
  {
    id: 6,
    title: "Phân quyền",
    permission: "ROLE_MANAGEMENT",
    icon: Shield,
    href: "/admin/roles"
  },
  {
    id: 7,
    title: "Kho ảnh",
    permission: "IMAGE_MANAGEMENT" as UserPermission,
    icon: Image,
    href: "/admin/images-storage"
  }
]