"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileHeader } from "@/components/mobile-header"
import { EbookCard } from "@/components/ebooks/ebook-card"
import { BookOpen } from "lucide-react"
import useSWR from "swr"
import { useEffect, useState } from "react"
import type { Ebook } from "@/lib/types"

const fetcher = async () => {
  const supabase = createClient()
  const { data } = await supabase
    .from("ebooks")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
  return data as Ebook[]
}

export default function EbooksPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { data: ebooks, isLoading: ebooksLoading } = useSWR("all-ebooks", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !authUser) {
        redirect("/auth/login")
        return
      }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      setUser(authUser)
      setProfile(profileData)
      setLoading(false)
    }

    getUser()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop header */}
      <div className="hidden lg:block">
        <DashboardHeader user={user} profile={profile} />
      </div>

      {/* Mobile header */}
      <div className="lg:hidden">
        <MobileHeader profile={profile} title="E-Books" showBack />
      </div>

      <main className="container mx-auto px-3 pt-14 pb-20 lg:px-6 lg:pt-8 lg:pb-8">
        <div className="mb-4 lg:mb-6">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30 lg:p-2.5">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 lg:h-6 lg:w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-3xl">E-Books</h1>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 lg:text-base">
            Baca artikel, jurnal, dan dokumen edukasi tentang diabetes
          </p>
        </div>

        {ebooksLoading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {ebooks?.map((ebook) => (
                <EbookCard key={ebook.id} ebook={ebook} />
              ))}
            </div>

            {(!ebooks || ebooks.length === 0) && (
              <div className="flex flex-col items-center justify-center py-16 lg:py-20">
                <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                  <BookOpen className="h-12 w-12 text-gray-400 lg:h-16 lg:w-16" />
                </div>
                <p className="mt-4 text-base text-gray-600 dark:text-gray-400 lg:text-lg">Belum ada e-book tersedia</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
