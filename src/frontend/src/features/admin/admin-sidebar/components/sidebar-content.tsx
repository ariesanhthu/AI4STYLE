import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ChartColumn, LucideProps, Users, ShoppingCart, Package, Boxes,  } from "lucide-react"
import Link from "next/link"
import React from "react"

export interface SidebarItem {
  id: number
  title: string
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  href: string
}

export const SIDEBAR_ITEMS: SidebarItem[] = [  
  {
    id: 1,
    title: "Dashboard",
    icon: ChartColumn ,
    href: "/admin/dashboard"
  },
  {
    id: 2,
    title: "Categories",
    icon: Boxes,
    href: "/admin/categories"
  },
  {
    id: 3,
    title: "Products",
    icon: Package,
    href: "/admin/products"
  },
  {
    id: 4,
    title: "Staffs",
    icon: Users,
    href: "/admin/staffs"
  },
  {
    id: 5,
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders"
  },

]

export function AdminSidebarContent() {

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {SIDEBAR_ITEMS.map((item: SidebarItem) => (
              <SidebarMenuItem key={item.title} className="h-30">
                {/* <SidebarMenuButton asChild className="h-full w-full"> */}
                  <Link href={item.href} className="flex flex-row h-full w-full justify-items-center items-center hover:bg-gray-200 rounded-lg p-4 gap-2">
                    <item.icon className="w-1/3"/>
                    <span className="w-2/3 text-2xl">{item.title}</span>
                  </Link>
                {/* </SidebarMenuButton> */}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}