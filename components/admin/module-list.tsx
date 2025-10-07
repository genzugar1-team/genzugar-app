"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, BookOpen } from "lucide-react"
import Link from "next/link"
import type { LearningModule } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ModuleListProps {
  modules: LearningModule[]
}

export function ModuleList({ modules }: ModuleListProps) {
  const router = useRouter()

  const togglePublish = async (moduleId: string, currentStatus: boolean) => {
    const supabase = createClient()
    await supabase.from("learning_modules").update({ is_published: !currentStatus }).eq("id", moduleId)
    router.refresh()
  }

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Yakin ingin menghapus modul ini?")) return

    const supabase = createClient()
    await supabase.from("learning_modules").delete().eq("id", moduleId)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <Card key={module.id} className="border-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="secondary">Modul {module.module_order}</Badge>
                  <Badge variant={module.is_published ? "default" : "outline"}>
                    {module.is_published ? "Dipublikasi" : "Draft"}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <p className="mt-2 text-base leading-relaxed text-gray-700 dark:text-gray-300">{module.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => togglePublish(module.id, module.is_published)}
                  title={module.is_published ? "Unpublish" : "Publish"}
                  className="bg-transparent"
                >
                  {module.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Link href={`/admin/modules/${module.id}`}>
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteModule(module.id)}
                  className="bg-transparent text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-base text-gray-700 dark:text-gray-300">
              Durasi: {module.estimated_duration_minutes} menit • {module.learning_objectives.length} tujuan
              pembelajaran
            </div>
          </CardContent>
        </Card>
      ))}

      {modules.length === 0 && (
        <Card className="border-2">
          <CardContent className="py-16 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Belum ada modul</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
