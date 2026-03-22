"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BrainCircuit,
  History,
  AlertTriangle,
  Plus,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "New Interview",
    href: "/dashboard/interview",
    icon: Plus,
    exact: true,
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: History,
    exact: false,
  },
  {
    label: "Weakness Engine",
    href: "/dashboard/weakness",
    icon: AlertTriangle,
    exact: false,
    badge: "AI",
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const user = session?.user
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-sidebar flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BrainCircuit className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg tracking-tight">InterviewAI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2 tracking-wider">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge
                  variant={isActive ? "outline" : "secondary"}
                  className={cn(
                    "text-xs px-1.5 py-0",
                    isActive
                      ? "border-primary-foreground/30 text-primary-foreground"
                      : ""
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Tip Card */}
      <div className="px-3 py-3 border-t border-b">
        <div className="bg-sidebar-accent rounded-lg px-3 py-2.5 space-y-1">
          <p className="text-xs font-semibold text-sidebar-foreground">
            🚀 Keep Practicing!
          </p>
          <p className="text-xs text-muted-foreground">
            Consistency is key to interview success.
          </p>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 space-y-2">
        {/* User Info */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              width={32}
              height={32}
              className="rounded-full shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-foreground">
                {initials}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}