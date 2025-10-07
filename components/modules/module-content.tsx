"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Video, Gamepad2, FileQuestion, CheckCircle, Lock } from "lucide-react"
import type { ModuleContent as ModuleContentType, UserProgress } from "@/lib/types"
import { ContentViewer } from "./content-viewer"

interface ModuleContentProps {
  moduleId: string
  userId: string
  content: ModuleContentType[]
  progress: UserProgress[]
}

export function ModuleContent({ moduleId, userId, content, progress }: ModuleContentProps) {
  const [selectedContent, setSelectedContent] = useState<ModuleContentType | null>(null)

  const progressMap = new Map(progress.map((p) => [p.content_id, p]))

  const getContentIcon = (type: string) => {
    switch (type) {
      case "ebook":
        return <BookOpen className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "game":
        return <Gamepad2 className="h-5 w-5" />
      case "quiz":
        return <FileQuestion className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "ebook":
        return "E-Book"
      case "video":
        return "Video"
      case "game":
        return "Game"
      case "quiz":
        return "Kuis"
      default:
        return type
    }
  }

  if (selectedContent) {
    return (
      <ContentViewer
        content={selectedContent}
        moduleId={moduleId}
        userId={userId}
        onBack={() => setSelectedContent(null)}
        progress={progressMap.get(selectedContent.id)}
      />
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Konten Pembelajaran</h2>

      {content.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {content.map((item, index) => {
            const itemProgress = progressMap.get(item.id)
            const isCompleted = itemProgress?.completed || false
            const isLocked = index > 0 && !progressMap.get(content[index - 1].id)?.completed

            return (
              <Card key={item.id} className={`border-2 ${isLocked ? "opacity-60" : "hover:shadow-lg"}`}>
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-sm">
                      {getContentTypeLabel(item.content_type)}
                    </Badge>
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Selesai</span>
                      </div>
                    )}
                    {isLocked && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Lock className="h-4 w-4" />
                        <span className="text-sm font-medium">Terkunci</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getContentIcon(item.content_type)}
                    {item.title}
                  </CardTitle>
                  {itemProgress?.score && (
                    <CardDescription className="text-base">Skor: {itemProgress.score}/100</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setSelectedContent(item)}
                    disabled={isLocked}
                    className="h-12 w-full text-base font-semibold"
                  >
                    {isCompleted ? "Lihat Lagi" : "Mulai"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-2">
          <CardContent className="py-16 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Konten belum tersedia</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
