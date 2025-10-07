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
import { Heart, BookOpen, User, LogOut, LayoutDashboard, BookMarked, Users, Video } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"

interface AdminHeaderProps {
  user: SupabaseUser
  profile: Profile | null
}

export function AdminHeader({ user, profile }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="border-b bg-white dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Gen-Zugar Admin</span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link href="/admin">
              <Button variant="ghost" size="lg" className="text-base">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/ebooks">
              <Button variant="ghost" size="lg" className="text-base">
                <BookOpen className="mr-2 h-5 w-5" />
                E-Books
              </Button>
            </Link>
            <Link href="/admin/videos">
              <Button variant="ghost" size="lg" className="text-base">
                <Video className="mr-2 h-5 w-5" />
                Videos
              </Button>
            </Link>
            <Link href="/admin/glossary">
              <Button variant="ghost" size="lg" className="text-base">
                <BookMarked className="mr-2 h-5 w-5" />
                Glosarium
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="ghost" size="lg" className="text-base">
                <Users className="mr-2 h-5 w-5" />
                Pengguna
              </Button>
            </Link>
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2 text-base bg-transparent">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{profile?.full_name || "Admin"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-base">
              <div className="flex flex-col gap-1">
                <p className="font-semibold">{profile?.full_name || "Admin"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-base">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                User Dashboard
              </Link>
            </DropdownMenuItem>
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
