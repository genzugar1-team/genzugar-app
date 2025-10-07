"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, BookOpen, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Ebook } from "@/lib/types"

interface EbookManagerProps {
  ebooks: Ebook[]
}

export function EbookManager({ ebooks }: EbookManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    estimated_duration: "",
    category: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      content: "",
      estimated_duration: "",
      category: "",
    })
    setEditingEbook(null)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("ebooks").insert([formData])

      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-ebooks")
      mutate("all-ebooks")

      setIsAddOpen(false)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error adding ebook:", error)
      alert("Gagal menambahkan e-book")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEbook) return

    setIsLoading(true)

    try {
      const { error } = await supabase.from("ebooks").update(formData).eq("id", editingEbook.id)

      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-ebooks")
      mutate("all-ebooks")

      setEditingEbook(null)
      resetForm()
      router.refresh()
    } catch (error) {
      console.error("Error updating ebook:", error)
      alert("Gagal mengupdate e-book")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus e-book ini?")) return

    setIsLoading(true)

    try {
      const { error } = await supabase.from("ebooks").delete().eq("id", id)

      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-ebooks")
      mutate("all-ebooks")

      router.refresh()
    } catch (error) {
      console.error("Error deleting ebook:", error)
      alert("Gagal menghapus e-book")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (ebook: Ebook) => {
    setEditingEbook(ebook)
    setFormData({
      title: ebook.title,
      description: ebook.description || "",
      content: ebook.content || "",
      estimated_duration: ebook.estimated_duration || "",
      category: ebook.category || "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="text-base">
              <Plus className="mr-2 h-5 w-5" />
              Tambah E-Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Tambah E-Book Baru</DialogTitle>
              <DialogDescription className="text-base">Isi informasi e-book pembelajaran</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">
                  Judul
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base">
                  Deskripsi
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base">
                  Konten
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="text-base font-mono"
                  placeholder="Tulis konten e-book di sini..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-base">
                    Durasi Estimasi
                  </Label>
                  <Input
                    id="duration"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                    placeholder="mis. 15 menit"
                    className="text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base">
                    Kategori
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="mis. Dasar Diabetes"
                    className="text-base"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isLoading}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {ebooks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Belum ada e-book. Tambahkan yang pertama!</p>
            </CardContent>
          </Card>
        ) : (
          ebooks.map((ebook) => (
            <Card key={ebook.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{ebook.title}</CardTitle>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{ebook.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                      {ebook.estimated_duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {ebook.estimated_duration}
                        </span>
                      )}
                      {ebook.category && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                          {ebook.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editingEbook?.id === ebook.id} onOpenChange={(open) => !open && resetForm()}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(ebook)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">Edit E-Book</DialogTitle>
                          <DialogDescription className="text-base">Update informasi e-book</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-title" className="text-base">
                              Judul
                            </Label>
                            <Input
                              id="edit-title"
                              value={formData.title}
                              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                              required
                              className="text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description" className="text-base">
                              Deskripsi
                            </Label>
                            <Textarea
                              id="edit-description"
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={3}
                              className="text-base"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-content" className="text-base">
                              Konten
                            </Label>
                            <Textarea
                              id="edit-content"
                              value={formData.content}
                              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                              rows={10}
                              className="text-base font-mono"
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="edit-duration" className="text-base">
                                Durasi Estimasi
                              </Label>
                              <Input
                                id="edit-duration"
                                value={formData.estimated_duration}
                                onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                                className="text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-category" className="text-base">
                                Kategori
                              </Label>
                              <Input
                                id="edit-category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="text-base"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => resetForm()} disabled={isLoading}>
                              Batal
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                              {isLoading ? "Menyimpan..." : "Update"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(ebook.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
