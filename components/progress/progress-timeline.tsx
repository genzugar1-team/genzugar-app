import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock } from "lucide-react"

interface ProgressTimelineProps {
  progress: Array<{
    completed: boolean
    completed_at: string | null
    learning_modules: { title: string; module_order: number }
    module_content: { title: string; content_type: string }
  }>
}

export function ProgressTimeline({ progress }: ProgressTimelineProps) {
  const completedItems = progress.filter((p) => p.completed && p.completed_at).slice(0, 10)

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

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Clock className="h-6 w-6" />
          Aktivitas Terakhir
        </CardTitle>
      </CardHeader>
      <CardContent>
        {completedItems.length > 0 ? (
          <div className="space-y-4">
            {completedItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4 rounded-lg border bg-white p-4 dark:bg-gray-800">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.module_content.title}
                    </h4>
                    <Badge variant="secondary" className="text-sm">
                      {getContentTypeLabel(item.module_content.content_type)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                    Modul {item.learning_modules.module_order}: {item.learning_modules.title}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                    {new Date(item.completed_at!).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">Belum ada aktivitas</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
