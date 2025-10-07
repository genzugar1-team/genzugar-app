import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, Target, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gen-Zugar</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="lg" className="text-base">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-base">
                Daftar Gratis
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center md:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-balance text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            Belajar Tentang Diabetes dengan Cara yang Menyenangkan
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-gray-700 dark:text-gray-300 md:text-xl">
            Platform edukasi interaktif untuk remaja Gen-Z yang ingin memahami diabetes, pencegahan, dan gaya hidup
            sehat. Belajar melalui video, game, dan kuis yang seru!
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full text-lg sm:w-auto">
                <Users className="mr-2 h-5 w-5" />
                Mulai Belajar Sekarang
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full text-lg sm:w-auto bg-transparent">
                <BookOpen className="mr-2 h-5 w-5" />
                Lihat Fitur
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-balance text-center text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Kenapa Pilih Gen-Zugar?
          </h3>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Materi Lengkap</h4>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  E-book, video, dan artikel yang mudah dipahami tentang diabetes dan pencegahannya.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Game Interaktif</h4>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Belajar sambil bermain dengan game edukatif yang seru dan menantang.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Kalkulator BMI</h4>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Pantau kesehatan kamu dengan kalkulator BMI dan riwayat pengukuran.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Tracking Progress</h4>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Lihat perkembangan belajar kamu dan raih semua achievement!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <h3 className="text-balance text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Siap Mulai Perjalanan Sehat Kamu?
          </h3>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            Bergabung dengan ribuan remaja lainnya yang sudah belajar tentang diabetes dan gaya hidup sehat.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="mt-6 text-lg">
              Daftar Sekarang - Gratis!
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
          <p className="text-base">&copy; 2025 Gen-Zugar. Platform edukasi diabetes untuk Gen-Z.</p>
        </div>
      </footer>
    </div>
  )
}
