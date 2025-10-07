import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 lg:pb-8">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-balance text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
            Profil Saya
          </h1>
          <p className="mt-2 text-pretty text-base text-gray-700 dark:text-gray-300 md:text-lg">
            Kelola informasi profil kamu
          </p>
        </div>

        <ProfileForm user={user} profile={profile} />
      </main>
    </div>
  )
}
