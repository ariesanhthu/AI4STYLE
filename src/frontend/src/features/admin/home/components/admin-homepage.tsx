import Link from "next/link";
import { SIDEBAR_ITEMS } from "../../admin-sidebar";


export function AdminHomepage() {
  return (
    <div className="flex flex-col">
      <div className="h-1/5">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      </div>

      <div className="icon-grid">
        {SIDEBAR_ITEMS.map((item) => (
          <Link
            href={item.href}
            key={item.id}
            className="icon-button"
          >
              <item.icon className="icon-button-image"/>
            <span className="icon-button-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
