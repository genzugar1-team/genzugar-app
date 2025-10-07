"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, LogIn, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", data.user.id).single()

      if (profile?.is_admin) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
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
            <CardTitle className="text-3xl font-bold">Masuk</CardTitle>
            <CardDescription className="text-base">Masukkan email dan password untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password" className="text-base font-semibold">
                    <Lock className="mr-2 inline h-4 w-4" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-base text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}
                <Button type="submit" className="h-12 text-base font-semibold" disabled={isLoading}>
                  <LogIn className="mr-2 h-5 w-5" />
                  {isLoading ? "Memproses..." : "Masuk"}
                </Button>
              </div>
              <div className="mt-6 text-center text-base">
                Belum punya akun?{" "}
                <Link href="/auth/sign-up" className="font-semibold text-primary underline underline-offset-4">
                  Daftar di sini
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
