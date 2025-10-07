"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, UserPlus, Mail, Lock, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
    dateOfBirth: "",
    gender: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.repeatPassword) {
      setError("Password tidak cocok")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

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
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold">Daftar Akun</CardTitle>
            <CardDescription className="text-base">Buat akun baru untuk mulai belajar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-3">
                  <Label htmlFor="fullName" className="text-base font-semibold">
                    <User className="mr-2 inline h-4 w-4" />
                    Nama Lengkap
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nama lengkap kamu"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="email" className="text-base font-semibold">
                    <Mail className="mr-2 inline h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="dateOfBirth" className="text-base font-semibold">
                    <Calendar className="mr-2 inline h-4 w-4" />
                    Tanggal Lahir
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="gender" className="text-base font-semibold">
                    Jenis Kelamin
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    required
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="text-base">
                        Laki-laki
                      </SelectItem>
                      <SelectItem value="female" className="text-base">
                        Perempuan
                      </SelectItem>
                      <SelectItem value="other" className="text-base">
                        Lainnya
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-base font-semibold">
                    <Lock className="mr-2 inline h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 6 karakter"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="repeatPassword" className="text-base font-semibold">
                    <Lock className="mr-2 inline h-4 w-4" />
                    Ulangi Password
                  </Label>
                  <Input
                    id="repeatPassword"
                    type="password"
                    placeholder="Ketik ulang password"
                    required
                    value={formData.repeatPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        repeatPassword: e.target.value,
                      })
                    }
                    className="h-12 text-base"
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-base text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                <Button type="submit" className="h-12 text-base font-semibold" disabled={isLoading}>
                  <UserPlus className="mr-2 h-5 w-5" />
                  {isLoading ? "Memproses..." : "Daftar Sekarang"}
                </Button>
              </div>
              <div className="mt-6 text-center text-base">
                Sudah punya akun?{" "}
                <Link href="/auth/login" className="font-semibold text-primary underline underline-offset-4">
                  Masuk di sini
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
