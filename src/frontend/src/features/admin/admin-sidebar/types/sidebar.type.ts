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
    title: "Dashboard",
    permission: "DASHBOARD_ACCESS",
    icon: ChartColumn,
    href: "/admin/dashboard"
  },
  {
    id: 2,
    title: "Categories",
    permission: "CATEGORY_MANAGEMENT",
    icon: Boxes,
    href: "/admin/categories"
  },
  {
    id: 3,
    title: "Products",
    permission: "PRODUCT_MANAGEMENT",
    icon: Package,
    href: "/admin/products"
  },
  {
    id: 4,
    title: "Orders",
    permission: "ORDER_MANAGEMENT",
    icon: ShoppingCart,
    href: "/admin/orders"
  },
  {
    id: 5,
    title: "Users",
    permission: "USER_MANAGEMENT",
    icon: Users,
    href: "/admin/users"
  },
  {
    id: 6,
    title: "Roles",
    permission: "ROLE_MANAGEMENT",
    icon: Shield,
    href: "/admin/roles"
  },
  {
    id: 7,
    title: "Images",
    permission: "IMAGE_MANAGEMENT" as UserPermission,
    icon: Image,
    href: "/admin/images-storage"
  }
]