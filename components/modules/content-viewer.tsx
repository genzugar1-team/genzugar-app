"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Video, Gamepad2, FileQuestion } from "lucide-react"
import type { ModuleContent, UserProgress } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ContentViewerProps {
  content: ModuleContent
  moduleId: string
  userId: string
  onBack: () => void
  progress?: UserProgress
}

export function ContentViewer({ content, moduleId, userId, onBack, progress }: ContentViewerProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  const markAsComplete = async () => {
    setIsCompleting(true)
    const supabase = createClient()

    try {
      // Check if progress exists
      if (progress) {
        await supabase
          .from("user_progress")
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", progress.id)
      } else {
        await supabase.from("user_progress").insert({
          user_id: userId,
          module_id: moduleId,
          content_id: content.id,
          completed: true,
          completed_at: new Date().toISOString(),
        })
      }

      router.refresh()
      onBack()
    } catch (error) {
      console.error("[v0] Error marking content as complete:", error)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="lg" onClick={onBack} className="text-base">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Kembali ke Daftar Konten
      </Button>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">{content.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {content.content_type === "ebook" && (
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Konten E-Book</h3>
                <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Ini adalah placeholder untuk konten e-book. Dalam implementasi lengkap, konten e-book akan ditampilkan
                  di sini dengan format yang mudah dibaca, termasuk gambar, diagram, dan teks yang terstruktur dengan
                  baik.
                </p>
                <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Konten akan mencakup informasi lengkap tentang topik yang dipilih, dengan penjelasan yang mudah
                  dipahami untuk remaja Gen-Z.
                </p>
              </div>
            </div>
          )}

          {content.content_type === "video" && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg bg-gray-900">
                <div className="flex h-full items-center justify-center text-white">
                  <div className="text-center">
                    <Video className="mx-auto h-16 w-16 text-gray-400" />
                    <p className="mt-4 text-lg">Video Player Placeholder</p>
                    <p className="mt-2 text-base text-gray-400">Video pembelajaran akan ditampilkan di sini</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  Video ini akan menjelaskan topik dengan visual yang menarik dan mudah dipahami.
                </p>
              </div>
            </div>
          )}

          {content.content_type === "game" && (
            <div className="space-y-4">
              <div className="rounded-lg border-2 bg-gradient-to-br from-purple-50 to-blue-50 p-8 dark:from-purple-900/20 dark:to-blue-900/20">
                <div className="text-center">
                  <Gamepad2 className="mx-auto h-16 w-16 text-primary" />
                  <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Game Interaktif</h3>
                  <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Game edukatif interaktif akan ditampilkan di sini. Pemain akan belajar sambil bermain dengan
                    tantangan yang menyenangkan.
                  </p>
                  <Button size="lg" className="mt-6 text-base">
                    Mulai Game
                  </Button>
                </div>
              </div>
            </div>
          )}

          {content.content_type === "quiz" && (
            <div className="space-y-4">
              <div className="rounded-lg border-2 bg-gradient-to-br from-green-50 to-blue-50 p-8 dark:from-green-900/20 dark:to-blue-900/20">
                <div className="text-center">
                  <FileQuestion className="mx-auto h-16 w-16 text-primary" />
                  <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Kuis Interaktif</h3>
                  <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Uji pemahaman kamu dengan kuis interaktif. Jawab pertanyaan untuk mendapatkan skor dan melanjutkan
                    ke modul berikutnya.
                  </p>
                  <Button size="lg" className="mt-6 text-base">
                    Mulai Kuis
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!progress?.completed && (
            <Button
              onClick={markAsComplete}
              disabled={isCompleting}
              size="lg"
              className="h-12 w-full text-base font-semibold"
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              {isCompleting ? "Memproses..." : "Tandai Selesai"}
            </Button>
          )}

          {progress?.completed && (
            <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
              <CheckCircle className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
              <p className="mt-2 text-base font-semibold text-green-600 dark:text-green-400">
                Kamu sudah menyelesaikan konten ini!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
