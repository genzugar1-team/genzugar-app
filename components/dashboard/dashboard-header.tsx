"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Heart, BookOpen, User, LogOut, Home, BookMarked, Video } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"

interface DashboardHeaderProps {
  user: SupabaseUser
  profile: Profile | null
}

export function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="hidden border-b bg-white dark:bg-gray-800 lg:block">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          <span className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">Gen-Zugar</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="lg" className="text-base">
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/ebooks">
            <Button variant="ghost" size="lg" className="text-base">
              <BookOpen className="mr-2 h-5 w-5" />
              E-Books
            </Button>
          </Link>
          <Link href="/videos">
            <Button variant="ghost" size="lg" className="text-base">
              <Video className="mr-2 h-5 w-5" />
              Videos
            </Button>
          </Link>
          <Link href="/glossary">
            <Button variant="ghost" size="lg" className="text-base">
              <BookMarked className="mr-2 h-5 w-5" />
              Glosarium
            </Button>
          </Link>
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2 text-base bg-transparent">
              <User className="h-5 w-5" />
              <span>{profile?.full_name || "User"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-base">
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{profile?.full_name || "User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-base">
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Profil Saya
              </Link>
            </DropdownMenuItem>
            {profile?.is_admin && (
              <DropdownMenuItem asChild className="text-base">
                <Link href="/admin">
                  <User className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-base text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
