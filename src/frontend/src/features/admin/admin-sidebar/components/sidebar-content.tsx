import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import React from "react"
import { useAdminAuth } from "@/features/admin/hooks/use-admin-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarItem } from "../types/sidebar.type";

export function AdminSidebarContent() {
  const { sideBarContent } = useAdminAuth();
  if (!sideBarContent) return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {sideBarContent?.map((item: SidebarItem) => (
              <SidebarMenuItem key={item.title} className="h-30 rounded-lg hover:bg-primary/10 hover:border-sidebar-ring hover:border hover:cursor-pointer hover:h-35 hover:transition-all hover:duration-300 hover:ease-out hover:ease-in hover:font-bold">
                {/* <SidebarMenuButton asChild className="h-full w-full"> */}
                <Link href={item.href} className="flex flex-row h-full w-full justify-items-center items-center rounded-lg p-4 gap-2">
                  <item.icon className="w-1/3 text-primary bold" />
                  <span className="w-2/3 text-xl text-foreground">{item.title}</span>
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