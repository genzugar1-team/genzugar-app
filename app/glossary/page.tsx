import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GlossarySearch } from "@/components/glossary/glossary-search"
import { BookMarked } from "lucide-react"

export default async function GlossaryPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: terms } = await supabase.from("glossary").select("*").order("term", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 lg:pb-8">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <BookMarked className="h-8 w-8 text-green-600 md:h-10 md:w-10" />
            <h1 className="text-balance text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
              Glosarium
            </h1>
          </div>
          <p className="mt-2 text-pretty text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg">
            Kamus istilah penting seputar diabetes dan kesehatan
          </p>
        </div>

        <GlossarySearch terms={terms || []} />
      </main>
    </div>
  )
}
