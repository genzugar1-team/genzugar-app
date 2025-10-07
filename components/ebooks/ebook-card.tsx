import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, User } from "lucide-react"
import type { Ebook } from "@/lib/types"
import Image from "next/image"

interface EbookCardProps {
  ebook: Ebook
}

export function EbookCard({ ebook }: EbookCardProps) {
  return (
    <Link href={`/ebooks/${ebook.id}`} className="group block">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all active:scale-[0.98] group-hover:shadow-md dark:bg-gray-800">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <Image
            src={ebook.thumbnail_url || "/placeholder.svg?height=300&width=400&query=diabetes education book"}
            alt={ebook.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-3 lg:p-4">
          {/* Category badge */}
          {ebook.category && (
            <Badge variant="secondary" className="mb-2 w-fit rounded-full text-[10px] lg:text-xs">
              {ebook.category}
            </Badge>
          )}

          {/* Title */}
          <h3 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-tight text-gray-900 dark:text-white lg:text-base lg:mb-2">
            {ebook.title}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400 lg:text-sm">
            {ebook.description}
          </p>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 lg:gap-3">
            {ebook.author && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="truncate">{ebook.author}</span>
              </div>
            )}
            {ebook.estimated_read_minutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{ebook.estimated_read_minutes} menit</span>
              </div>
            )}
          </div>

          {/* Read button */}
          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <BookOpen className="h-4 w-4" />
            <span>Baca Sekarang</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
