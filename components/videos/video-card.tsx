"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Video, Clock, ExternalLink } from "lucide-react"
import type { EducationalVideo } from "@/lib/types"
import Image from "next/image"

interface VideoCardProps {
  video: EducationalVideo
  userId: string
}

export function VideoCard({ video }: VideoCardProps) {
  const handleWatchVideo = () => {
    window.open(video.youtube_url, "_blank")
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] rounded-2xl border-0 shadow-sm bg-white dark:bg-gray-800">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <Image
          src={video.thumbnail_url || "/placeholder.svg?height=360&width=640&query=diabetes education video thumbnail"}
          alt={video.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="rounded-full bg-white/90 p-3 lg:p-4">
            <Video className="h-6 w-6 lg:h-8 lg:w-8 text-purple-600" />
          </div>
        </div>
      </div>

      <CardHeader className="flex-1 pb-2 p-3 lg:p-6 lg:pb-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {video.category && (
            <Badge variant="secondary" className="text-[10px] lg:text-xs rounded-full">
              {video.category}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2 text-balance text-sm leading-tight lg:text-xl">{video.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-pretty text-xs leading-relaxed lg:text-base">
          {video.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2 p-3 lg:p-6 lg:pb-3">
        {video.duration_minutes && (
          <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
            <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="text-[10px] lg:text-sm">{video.duration_minutes} menit</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 lg:p-6">
        <Button
          className="w-full text-sm lg:text-base h-10 lg:h-12 rounded-xl font-semibold active:scale-95 transition-transform"
          size="lg"
          onClick={handleWatchVideo}
        >
          <Video className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
          Tonton Sekarang
          <ExternalLink className="ml-2 h-3 w-3 lg:h-4 lg:w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
