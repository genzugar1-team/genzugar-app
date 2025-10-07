import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Video, BookMarked } from "lucide-react"

interface AdminStatsProps {
  totalUsers: number
  totalEbooks: number
  totalVideos: number
  totalGlossary: number
}

export function AdminStats({ totalUsers, totalEbooks, totalVideos, totalGlossary }: AdminStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
            <Users className="h-5 w-5" />
            Total Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
            <BookOpen className="h-5 w-5" />
            Total E-Books
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalEbooks}</p>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
            <Video className="h-5 w-5" />
            Total Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalVideos}</p>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
            <BookMarked className="h-5 w-5" />
            Istilah Glosarium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalGlossary}</p>
        </CardContent>
      </Card>
    </div>
  )
}
