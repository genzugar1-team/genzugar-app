import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6 dark:from-gray-900 dark:to-gray-800 md:p-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-10 w-10 text-red-500" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">Gen-Zugar</span>
          </Link>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-300" />
            </div>
            <CardTitle className="text-3xl font-bold">Oops, Ada Masalah</CardTitle>
            <CardDescription className="text-base">Terjadi kesalahan saat memproses permintaan kamu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {params?.error && (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-base font-semibold text-red-600 dark:text-red-400">Error: {params.error}</p>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="h-12 w-full text-base font-semibold">Kembali ke Halaman Masuk</Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="h-12 w-full text-base font-semibold bg-transparent">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
