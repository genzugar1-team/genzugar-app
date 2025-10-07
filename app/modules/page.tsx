import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ModuleCard } from "@/components/modules/module-card"
import { BookOpen } from "lucide-react"

export default async function ModulesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch all published modules
  const { data: modules } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("is_published", true)
    .order("module_order", { ascending: true })

  // Fetch user progress
  const { data: progress } = await supabase
    .from("user_progress")
    .select("module_id, content_id, completed")
    .eq("user_id", user.id)

  const progressMap = new Map(progress?.map((p) => [p.module_id, p]) || [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Modul Belajar</h1>
          </div>
          <p className="mt-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Pelajari tentang diabetes melalui modul interaktif yang mudah dipahami
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules?.map((module) => {
            const userProgress = progressMap.get(module.id)
            return <ModuleCard key={module.id} module={module} progress={userProgress} />
          })}
        </div>

        {(!modules || modules.length === 0) && (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Belum ada modul tersedia</p>
          </div>
        )}
      </main>
    </div>
  )
}
