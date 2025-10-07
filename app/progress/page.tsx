import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProgressOverview } from "@/components/progress/progress-overview"
import { ProgressTimeline } from "@/components/progress/progress-timeline"
import { TrendingUp } from "lucide-react"

export default async function ProgressPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user progress with module details
  const { data: progress } = await supabase
    .from("user_progress")
    .select(
      `
      *,
      learning_modules!inner(title, module_order),
      module_content!inner(title, content_type)
    `,
    )
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })

  // Fetch all modules for completion stats
  const { data: allModules } = await supabase
    .from("learning_modules")
    .select("id, title")
    .eq("is_published", true)
    .order("module_order", { ascending: true })

  // Fetch BMI history
  const { data: bmiHistory } = await supabase
    .from("bmi_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Progress Belajar</h1>
          </div>
          <p className="mt-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Lihat perkembangan dan pencapaian belajar kamu
          </p>
        </div>

        <ProgressOverview progress={progress || []} allModules={allModules || []} bmiHistory={bmiHistory || []} />

        <div className="mt-8">
          <ProgressTimeline progress={progress || []} />
        </div>
      </main>
    </div>
  )
}
