import {
  Sidebar,
} from "@/components/ui/sidebar"
import { AdminSidebarHeader } from "./sidebar-header"
import { AdminSidebarContent } from "./sidebar-content"
import { AdminSidebarFooter } from "./sidebar-footer"



export function AdminSidebar() {

  return (
    <Sidebar variant="sidebar">
      <AdminSidebarHeader/>
      <AdminSidebarContent/>
      <AdminSidebarFooter/>
    </Sidebar>
  )
}