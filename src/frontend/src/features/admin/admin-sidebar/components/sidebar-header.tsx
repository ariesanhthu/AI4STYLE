import {
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle"


export function AdminSidebarHeader() {
  return (
    <SidebarHeader>
      <div className="flex items-center justify-between w-full">
        <Link href={'/admin'}>
          <span>Admin Panel</span>
        </Link>
        <ThemeToggle />
      </div>
    </SidebarHeader>
  )
}