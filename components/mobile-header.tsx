"use client"

import { ChevronLeft, User } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/types"

interface MobileHeaderProps {
  profile: Profile | null
  showBack?: boolean
  title?: string
}

export function MobileHeader({ profile, showBack = false, title }: MobileHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getTitle = () => {
    if (title) return title
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/ebooks") return "E-Books"
    if (pathname === "/videos") return "Videos"
    if (pathname === "/glossary") return "Glosarium"
    if (pathname === "/profile") return "Profil"
    return "Gen-Zugar"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-800/50">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Left side - Back button or spacer */}
          <div className="w-20">
            {showBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="h-8 w-8 p-0 rounded-full active:scale-95 transition-transform"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Center - Title */}
          <h1 className="text-base font-semibold text-gray-900 dark:text-white truncate">{getTitle()}</h1>

          {/* Right side - Profile */}
          <div className="w-20 flex justify-end">
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full active:scale-95 transition-transform"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
