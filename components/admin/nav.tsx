"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, ShoppingBag, BarChart, Settings, Shield, AlertTriangle, FileText } from "lucide-react"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Models",
    href: "/admin/models",
    icon: ShoppingBag,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Vendors",
    href: "/admin/vendors",
    icon: BarChart,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: FileText,
  },
  {
    title: "Security",
    href: "/admin/security",
    icon: Shield,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: AlertTriangle,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 p-4">
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
            pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5",
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

