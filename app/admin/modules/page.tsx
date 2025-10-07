import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { ModuleList } from "@/components/admin/module-list"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminModulesPage() {
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

  const { data: modules } = await supabase
    .from("learning_modules")
    .select("*")
    .order("module_order", { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Kelola Modul</h1>
            </div>
            <p className="mt-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              Tambah, edit, atau hapus modul pembelajaran
            </p>
          </div>
          <Link href="/admin/modules/new">
            <Button size="lg" className="text-base">
              <Plus className="mr-2 h-5 w-5" />
              Tambah Modul
            </Button>
          </Link>
        </div>

        <ModuleList modules={modules || []} />
      </main>
    </div>
  )
}
