'use client'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { AdminSidebar } from "@/features/admin/admin-sidebar/components/admin-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <main className="m-5">
          {children}
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}