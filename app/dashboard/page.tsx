import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileHeader } from "@/components/mobile-header"
import { BMICalculator } from "@/components/dashboard/bmi-calculator"
import { RecentEbooks } from "@/components/dashboard/recent-ebooks"
import { RecentVideos } from "@/components/dashboard/recent-videos"
import { BookOpen, Video, BookMarked } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { count: totalEbooks } = await supabase.from("ebooks").select("*", { count: "exact", head: true })
  const { count: totalVideos } = await supabase.from("educational_videos").select("*", { count: "exact", head: true })
  const { count: totalGlossary } = await supabase.from("glossary").select("*", { count: "exact", head: true })

  const { data: bmiHistory } = await supabase
    .from("bmi_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop header - hidden on mobile */}
      <div className="hidden lg:block">
        <DashboardHeader user={user} profile={profile} />
      </div>

      {/* Mobile header - iOS style */}
      <div className="lg:hidden">
        <MobileHeader profile={profile} />
      </div>

      <main className="container mx-auto px-3 pt-14 pb-20 lg:px-6 lg:pt-8 lg:pb-8">
        {/* Welcome Section - iOS style */}
        <div className="mb-4 lg:mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-4xl">
            Halo, {profile?.full_name || "User"}!
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 lg:text-base lg:mt-2">
            Selamat datang kembali di perjalanan belajar kamu
          </p>
        </div>

        {/* Stats Cards - iOS grouped style */}
        <div className="mb-5 grid grid-cols-3 gap-2 lg:mb-6 lg:gap-4">
          <Link href="/ebooks" className="group">
            <div className="rounded-2xl bg-white p-3 shadow-sm transition-all active:scale-95 group-hover:shadow-md dark:bg-gray-800 lg:p-5">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30 lg:mb-3 lg:p-3">
                  <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 lg:h-6 lg:w-6" />
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white lg:text-3xl">{totalEbooks || 0}</div>
                <p className="mt-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400 lg:text-xs lg:mt-1">
                  E-Books
                </p>
              </div>
            </div>
          </Link>

          <Link href="/videos" className="group">
            <div className="rounded-2xl bg-white p-3 shadow-sm transition-all active:scale-95 group-hover:shadow-md dark:bg-gray-800 lg:p-5">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 rounded-full bg-purple-100 p-2 dark:bg-purple-900/30 lg:mb-3 lg:p-3">
                  <Video className="h-4 w-4 text-purple-600 dark:text-purple-400 lg:h-6 lg:w-6" />
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white lg:text-3xl">{totalVideos || 0}</div>
                <p className="mt-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400 lg:text-xs lg:mt-1">
                  Videos
                </p>
              </div>
            </div>
          </Link>

          <Link href="/glossary" className="group">
            <div className="rounded-2xl bg-white p-3 shadow-sm transition-all active:scale-95 group-hover:shadow-md dark:bg-gray-800 lg:p-5">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 rounded-full bg-green-100 p-2 dark:bg-green-900/30 lg:mb-3 lg:p-3">
                  <BookMarked className="h-4 w-4 text-green-600 dark:text-green-400 lg:h-6 lg:w-6" />
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white lg:text-3xl">{totalGlossary || 0}</div>
                <p className="mt-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400 lg:text-xs lg:mt-1">
                  Glossary
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content - iOS style layout */}
        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
          <BMICalculator userId={user.id} profile={profile} bmiHistory={bmiHistory || []} />

          <div className="space-y-4 lg:space-y-6">
            <RecentEbooks userId={user.id} />
            <RecentVideos userId={user.id} />
          </div>
        </div>
      </main>
    </div>
  )
}
