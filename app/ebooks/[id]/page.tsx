import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { EbookReader } from "@/components/ebooks/ebook-reader"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function EbookDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: ebook } = await supabase.from("ebooks").select("*").eq("id", params.id).single()

  if (!ebook) {
    redirect("/ebooks")
  }

  const { data: progress } = await supabase
    .from("ebook_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("ebook_id", params.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-900 md:pb-0">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <Link href="/ebooks">
          <Button variant="ghost" size="lg" className="mb-4 text-base">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Kembali ke E-Books
          </Button>
        </Link>

        <EbookReader ebook={ebook} progress={progress} userId={user.id} />
      </main>

      <MobileNav />
    </div>
  )
}
