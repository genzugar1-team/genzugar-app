import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ModuleContent } from "@/components/modules/module-content"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, Target } from "lucide-react"
import Link from "next/link"

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch module details
  const { data: module } = await supabase.from("learning_modules").select("*").eq("id", id).single()

  if (!module) {
    redirect("/modules")
  }

  // Fetch module content
  const { data: content } = await supabase
    .from("module_content")
    .select("*")
    .eq("module_id", id)
    .order("content_order", { ascending: true })

  // Fetch user progress for this module
  const { data: progress } = await supabase.from("user_progress").select("*").eq("user_id", user.id).eq("module_id", id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <Link href="/modules">
          <Button variant="ghost" size="lg" className="mb-6 text-base">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Kembali ke Modul
          </Button>
        </Link>

        <div className="mb-8 rounded-lg border-2 bg-white p-6 dark:bg-gray-800 md:p-8">
          <div className="mb-4 text-base font-semibold text-primary">Modul {module.module_order}</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">{module.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300">{module.description}</p>

          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-base text-gray-700 dark:text-gray-300">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>Durasi: {module.estimated_duration_minutes} menit</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <Target className="h-6 w-6 text-primary" />
              <span>Tujuan Pembelajaran</span>
            </div>
            <ul className="ml-8 space-y-2 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {module.learning_objectives.map((objective, index) => (
                <li key={index} className="list-disc">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ModuleContent moduleId={id} userId={user.id} content={content || []} progress={progress || []} />
      </main>
    </div>
  )
}
