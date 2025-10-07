"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Calendar, Save } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  user: SupabaseUser
  profile: Profile | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    dateOfBirth: profile?.date_of_birth || "",
    gender: profile?.gender || "",
    heightCm: profile?.height_cm?.toString() || "",
    weightKg: profile?.weight_kg?.toString() || "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          date_of_birth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          height_cm: formData.heightCm ? Number.parseFloat(formData.heightCm) : null,
          weight_kg: formData.weightKg ? Number.parseFloat(formData.weightKg) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setMessage({ type: "success", text: "Profil berhasil diperbarui!" })
      router.refresh()
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal memperbarui profil",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="mx-auto max-w-2xl border-2">
      <CardHeader>
        <CardTitle className="text-2xl">Informasi Profil</CardTitle>
        <CardDescription className="text-base">Perbarui informasi pribadi kamu</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-semibold">
              Email
            </Label>
            <Input id="email" type="email" value={user.email} disabled className="h-12 text-base" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Email tidak dapat diubah</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-base font-semibold">
              <User className="mr-2 inline h-4 w-4" />
              Nama Lengkap
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-base font-semibold">
              <Calendar className="mr-2 inline h-4 w-4" />
              Tanggal Lahir
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-base font-semibold">
              Jenis Kelamin
            </Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heightCm" className="text-base font-semibold">
                Tinggi Badan (cm)
              </Label>
              <Input
                id="heightCm"
                type="number"
                placeholder="170"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weightKg" className="text-base font-semibold">
                Berat Badan (kg)
              </Label>
              <Input
                id="weightKg"
                type="number"
                placeholder="60"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                className="h-12 text-base"
              />
            </div>
          </div>

          {message && (
            <div
              className={`rounded-lg p-4 text-base ${
                message.type === "success"
                  ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isSaving} className="h-12 w-full text-base font-semibold">
            <Save className="mr-2 h-5 w-5" />
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
