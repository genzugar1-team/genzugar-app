import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, BookOpen, Trophy, Activity } from "lucide-react"
import type { BMIHistory } from "@/lib/types"

interface ProgressOverviewProps {
  progress: Array<{
    completed: boolean
    learning_modules: { title: string; module_order: number }
  }>
  allModules: Array<{ id: string; title: string }>
  bmiHistory: BMIHistory[]
}

export function ProgressOverview({ progress, allModules, bmiHistory }: ProgressOverviewProps) {
  const completedModules = new Set(progress.filter((p) => p.completed).map((p) => p.learning_modules.title)).size
  const totalModules = allModules.length
  const progressPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  const totalPoints = completedModules * 100

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
              <BookOpen className="h-5 w-5" />
              Modul Selesai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {completedModules}/{totalModules}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
              <CheckCircle className="h-5 w-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{progressPercentage}%</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
              <Trophy className="h-5 w-5" />
              Total Poin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalPoints}</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-600 dark:text-gray-400">
              <Activity className="h-5 w-5" />
              Cek BMI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">{bmiHistory.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">Progress Keseluruhan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-base">
              <span className="font-medium text-gray-700 dark:text-gray-300">Penyelesaian Modul</span>
              <span className="font-bold text-gray-900 dark:text-white">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Modul Selesai</p>
              <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{completedModules}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Modul Tersisa</p>
              <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {totalModules - completedModules}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
