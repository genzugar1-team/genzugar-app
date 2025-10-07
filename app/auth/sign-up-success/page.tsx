import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
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
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-300" />
            </div>
            <CardTitle className="text-3xl font-bold">Pendaftaran Berhasil!</CardTitle>
            <CardDescription className="text-base">Cek email kamu untuk verifikasi akun</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex gap-3">
                <Mail className="h-6 w-6 flex-shrink-0 text-blue-600 dark:text-blue-300" />
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">Verifikasi Email</p>
                  <p className="mt-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    Kami telah mengirim email verifikasi ke alamat email kamu. Silakan cek inbox atau folder spam, lalu
                    klik link verifikasi untuk mengaktifkan akun.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-center text-base text-gray-700 dark:text-gray-300">
                Setelah verifikasi, kamu bisa langsung masuk dan mulai belajar!
              </p>
              <Link href="/auth/login" className="block">
                <Button className="h-12 w-full text-base font-semibold">Kembali ke Halaman Masuk</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
