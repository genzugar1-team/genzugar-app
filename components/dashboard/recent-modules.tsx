import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface RecentModulesProps {
  userId: string
}

export async function RecentModules({ userId }: RecentModulesProps) {
  const supabase = await createClient()

  // Fetch published modules
  const { data: modules } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("is_published", true)
    .order("module_order", { ascending: true })
    .limit(3)

  // Fetch user progress for these modules
  const { data: progress } = await supabase.from("user_progress").select("module_id, completed").eq("user_id", userId)

  const progressMap = new Map(progress?.map((p) => [p.module_id, p.completed]) || [])

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <BookOpen className="h-6 w-6" />
          Modul Belajar
        </CardTitle>
        <CardDescription className="text-base">Lanjutkan perjalanan belajar kamu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules && modules.length > 0 ? (
          <>
            {modules.map((module) => {
              const isCompleted = progressMap.get(module.id) || false
              return (
                <div
                  key={module.id}
                  className="flex items-start justify-between gap-4 rounded-lg border bg-white p-4 transition-shadow hover:shadow-md dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{module.title}</h4>
                    <p className="mt-1 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                      {module.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {module.estimated_duration_minutes} menit
                      </span>
                      {isCompleted && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                          Selesai
                        </span>
                      )}
                    </div>
                  </div>
                  <Link href={`/modules/${module.id}`}>
                    <Button size="lg" className="text-base">
                      <ArrowRight className="h-5 w-5" />
                      <span className="sr-only">Buka modul</span>
                    </Button>
                  </Link>
                </div>
              )
            })}
            <Link href="/modules" className="block">
              <Button variant="outline" className="h-12 w-full text-base font-semibold bg-transparent">
                Lihat Semua Modul
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-base text-gray-600 dark:text-gray-400">Belum ada modul tersedia</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
