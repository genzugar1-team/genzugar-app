"use client"

import { Video } from "lucide-react"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import type { VideoType } from "@/lib/types"

const fetcher = async () => {
  const supabase = createClient()
  console.log("[v0] Fetching recent videos...")

  const { data, error } = await supabase
    .from("educational_videos")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3)

  console.log("[v0] Recent videos response:", { data, error, count: data?.length })

  if (error) {
    console.error("[v0] Error fetching recent videos:", error)
  }

  return data as VideoType[]
}

export function RecentVideos({ userId }: { userId: string }) {
  const { data: videos, isLoading } = useSWR("recent-videos", fetcher, {
    refreshInterval: 5000, // Auto-refresh every 5 seconds
    revalidateOnFocus: true,
  })

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800 lg:p-6">
      <div className="mb-3 flex items-center gap-2 lg:mb-4">
        <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/30">
          <Video className="h-4 w-4 text-purple-600 dark:text-purple-400 lg:h-5 lg:w-5" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white lg:text-lg">Video Terbaru</h3>
      </div>

      {isLoading ? (
        <div className="py-6 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="space-y-2 lg:space-y-3">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-gray-50 p-3 transition-all active:scale-[0.98] hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 lg:p-4"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white lg:text-base">{video.title}</h4>
              <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400 lg:text-sm">
                {video.description}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400">
                <Video className="h-3 w-3" />
                <span>Tonton di YouTube</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">Belum ada video tersedia</p>
      )}
    </div>
  )
}
