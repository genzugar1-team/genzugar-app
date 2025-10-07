import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { GlossaryManager } from "@/components/admin/glossary-manager"
import { BookMarked } from "lucide-react"

export default async function AdminGlossaryPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/dashboard")
  }

  const { data: terms } = await supabase.from("glossary").select("*").order("term", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <BookMarked className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Kelola Glosarium</h1>
          </div>
          <p className="mt-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Tambah, edit, atau hapus istilah dalam glosarium
          </p>
        </div>

        <GlossaryManager terms={terms || []} />
      </main>
    </div>
  )
}
