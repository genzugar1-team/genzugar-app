"use client"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { VideoCard } from "@/components/videos/video-card"
import { Video } from "lucide-react"
import useSWR from "swr"
import { useEffect, useState } from "react"
import type { VideoType } from "@/lib/types"

const fetcher = async () => {
  const supabase = createClient()
  console.log("[v0] Fetching all videos...")

  const { data, error } = await supabase
    .from("educational_videos")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  console.log("[v0] All videos response:", { data, error, count: data?.length })

  if (error) {
    console.error("[v0] Error fetching all videos:", error)
  }

  return data as VideoType[]
}

export default function VideosPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const { data: videos, isLoading: videosLoading } = useSWR("all-videos", fetcher, {
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
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900 lg:pb-8">
      <DashboardHeader user={user} profile={profile} />

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <Video className="h-8 w-8 text-purple-600 md:h-10 md:w-10" />
            <h1 className="text-balance text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
              Video Edukasi
            </h1>
          </div>
          <p className="mt-2 text-pretty text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg">
            Tonton video edukatif tentang diabetes dari YouTube
          </p>
        </div>

        {videosLoading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos?.map((video) => (
                <VideoCard key={video.id} video={video} userId={user.id} />
              ))}
            </div>

            {(!videos || videos.length === 0) && (
              <div className="py-16 text-center">
                <Video className="mx-auto h-16 w-16 text-gray-400" />
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Belum ada video tersedia</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
