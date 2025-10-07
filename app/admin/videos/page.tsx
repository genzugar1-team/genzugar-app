import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin/admin-header"
import { VideoManager } from "@/components/admin/video-manager"
import { Video } from "lucide-react"

export default async function AdminVideosPage() {
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

  const { data: videos } = await supabase
    .from("educational_videos")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Video className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">Kelola Videos</h1>
          </div>
          <p className="mt-2 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Tambah, edit, atau hapus video pembelajaran YouTube
          </p>
        </div>

        <VideoManager videos={videos || []} />
      </main>
    </div>
  )
}
