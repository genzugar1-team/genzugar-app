"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, User, ExternalLink, CheckCircle2 } from "lucide-react"
import type { Ebook, EbookProgress } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface EbookReaderProps {
  ebook: Ebook
  progress: EbookProgress | null
  userId: string
}

export function EbookReader({ ebook, progress, userId }: EbookReaderProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleMarkComplete = async () => {
    setIsCompleting(true)
    try {
      const { error } = await supabase.from("ebook_progress").upsert({
        user_id: userId,
        ebook_id: ebook.id,
        completed: true,
        completed_at: new Date().toISOString(),
      })

      if (!error) {
        router.refresh()
      }
    } catch (error) {
      console.error("Error marking ebook as complete:", error)
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="mb-4 flex flex-wrap gap-2">
              {ebook.category && (
                <Badge variant="secondary" className="text-sm">
                  {ebook.category}
                </Badge>
              )}
              {progress?.completed && (
                <Badge className="bg-green-500 text-sm">
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Selesai Dibaca
                </Badge>
              )}
            </div>
            <CardTitle className="text-2xl md:text-3xl">{ebook.title}</CardTitle>
            <CardDescription className="text-base leading-relaxed md:text-lg">{ebook.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 dark:text-gray-400">
              {ebook.author && (
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span>{ebook.author}</span>
                </div>
              )}
              {ebook.estimated_read_minutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{ebook.estimated_read_minutes} menit baca</span>
                </div>
              )}
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={ebook.thumbnail_url || "/placeholder.svg?height=600&width=800"}
                alt={ebook.title}
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="flex-1 text-base" asChild>
                <a href={ebook.document_url} target="_blank" rel="noopener noreferrer">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Buka Dokumen
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              {!progress?.completed && (
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 text-base bg-transparent"
                  onClick={handleMarkComplete}
                  disabled={isCompleting}
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  {isCompleting ? "Menyimpan..." : "Tandai Selesai"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Tentang E-Book Ini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed">
            <p className="text-gray-700 dark:text-gray-300">
              E-book ini berisi informasi lengkap dan terpercaya tentang diabetes yang ditulis khusus untuk remaja.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Anda dapat membaca dokumen ini secara online atau mengunduhnya untuk dibaca offline.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
