"use client"

import { BookOpen, Clock } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { createClient } from "@/lib/supabase/client"
import type { Ebook } from "@/lib/types"

const fetcher = async () => {
  const supabase = createClient()
  const { data } = await supabase
    .from("ebooks")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3)
  return data as Ebook[]
}

export function RecentEbooks({ userId }: { userId: string }) {
  const { data: ebooks, isLoading } = useSWR("recent-ebooks", fetcher, {
    refreshInterval: 5000, // Auto-refresh every 5 seconds
    revalidateOnFocus: true,
  })

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800 lg:p-6">
      <div className="mb-3 flex items-center gap-2 lg:mb-4">
        <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
          <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 lg:h-5 lg:w-5" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white lg:text-lg">E-Books Terbaru</h3>
      </div>

      {isLoading ? (
        <div className="py-6 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
        </div>
      ) : ebooks && ebooks.length > 0 ? (
        <div className="space-y-2 lg:space-y-3">
          {ebooks.map((ebook) => (
            <Link
              key={ebook.id}
              href={`/ebooks/${ebook.id}`}
              className="block rounded-xl bg-gray-50 p-3 transition-all active:scale-[0.98] hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 lg:p-4"
            >
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white lg:text-base">{ebook.title}</h4>
              <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400 lg:text-sm">
                {ebook.description}
              </p>
              {ebook.estimated_duration && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{ebook.estimated_duration}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">Belum ada e-book tersedia</p>
      )}
    </div>
  )
}
