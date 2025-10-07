import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ArrowRight, Target } from "lucide-react"
import Link from "next/link"
import type { LearningModule } from "@/lib/types"

interface ModuleCardProps {
  module: LearningModule
  progress?: { completed: boolean } | null
}

export function ModuleCard({ module, progress }: ModuleCardProps) {
  const isCompleted = progress?.completed || false

  return (
    <Card className="border-2 transition-all hover:shadow-lg">
      <CardHeader>
        <div className="mb-2 flex items-start justify-between">
          <Badge variant="secondary" className="text-sm">
            Modul {module.module_order}
          </Badge>
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Selesai</span>
            </div>
          )}
        </div>
        <CardTitle className="text-xl">{module.title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">{module.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-base text-gray-700 dark:text-gray-300">
            <Clock className="h-5 w-5 text-gray-500" />
            <span>{module.estimated_duration_minutes} menit</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
              <Target className="h-5 w-5 text-primary" />
              <span>Tujuan Pembelajaran:</span>
            </div>
            <ul className="ml-7 space-y-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {module.learning_objectives.slice(0, 3).map((objective, index) => (
                <li key={index} className="list-disc">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link href={`/modules/${module.id}`} className="block">
          <Button className="h-12 w-full text-base font-semibold">
            {isCompleted ? "Ulangi Modul" : "Mulai Belajar"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
