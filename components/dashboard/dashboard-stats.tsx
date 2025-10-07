import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle, Trophy, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
  completedModules: number
  totalModules: number
}

export function DashboardStats({ completedModules, totalModules }: DashboardStatsProps) {
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Total Modul</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{totalModules}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Selesai</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{completedModules}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Progress</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{progressPercentage}%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Poin</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{completedModules * 100}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
              <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
