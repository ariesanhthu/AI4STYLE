import {
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"


export function AdminSidebarHeader() {
  return (
    <SidebarHeader>
      <div className="flex items-center justify-center w-full hover:opacity-80 transition-opacity">
        <Link href={'/admin'} >
          <Image src="/logo.png" alt="Logo" width={100} height={100} />
        </Link>
      </div>
    </SidebarHeader>
  )
}