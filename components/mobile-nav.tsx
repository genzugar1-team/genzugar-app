"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Video, BookMarked } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()

  if (pathname.startsWith("/auth") || pathname === "/" || pathname.startsWith("/admin")) {
    return null
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/ebooks", icon: BookOpen, label: "E-Books" },
    { href: "/videos", icon: Video, label: "Videos" },
    { href: "/glossary", icon: BookMarked, label: "Glosarium" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-800/50">
        <div className="flex items-center justify-around px-4 pb-safe safe-area-inset-bottom">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 px-4 transition-all duration-200 active:scale-95",
                  "min-w-[60px]",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200",
                    isActive ? "bg-blue-500 shadow-lg shadow-blue-500/30" : "bg-transparent",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-400",
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    isActive ? "text-blue-500" : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
