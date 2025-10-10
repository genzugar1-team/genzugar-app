"use client"

import React, { useState } from "react"
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

interface FormDataState {
  title: string
  description: string
  author: string
  document_url: string
  thumbnail_url: string
  category: string
  estimated_read_minutes: string
  is_published: boolean
  documentFile: File | null
  thumbnailFile: File | null
}

export function EbookManager({ ebooks }: EbookManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    description: "",
    author: "",
    document_url: "",
    thumbnail_url: "",
    category: "",
    estimated_read_minutes: "",
    is_published: false,
    documentFile: null,
    thumbnailFile: null,
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      author: "",
      document_url: "",
      thumbnail_url: "",
      category: "",
      estimated_read_minutes: "",
      is_published: false,
      documentFile: null,
      thumbnailFile: null,
    })
    setEditingEbook(null)
  }

  // helper upload file ke Supabase Storage (bucket: 'ebooks')
  async function uploadToStorage(file: File, folder: "documents" | "thumbnails") {
    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`
    const path = `${folder}/${safeName}`

    const { error: uploadError } = await supabase.storage.from("ebooks").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })
    if (uploadError) throw uploadError

    const { data } = supabase.storage.from("ebooks").getPublicUrl(path)
    // data.publicUrl is typically available; cek di supabase versi mu bila berbeda
    return data.publicUrl as string
  }

  // Tambah ebook baru (upload file bila ada)
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let documentUrl = formData.document_url
      let thumbnailUrl = formData.thumbnail_url

      // Upload file PDF jika dipilih
      if (formData.documentFile) {
        documentUrl = await uploadToStorage(formData.documentFile, "documents")
      }

      // Upload thumbnail jika dipilih
      if (formData.thumbnailFile) {
        thumbnailUrl = await uploadToStorage(formData.thumbnailFile, "thumbnails")
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        author: formData.author || null,
        document_url: documentUrl,
        thumbnail_url: thumbnailUrl || null,
        category: formData.category || null,
        estimated_read_minutes: formData.estimated_read_minutes
          ? parseInt(formData.estimated_read_minutes, 10)
          : null,
        is_published: formData.is_published,
      }

      const { error } = await supabase.from("ebooks").insert([payload])
      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-ebooks")
      mutate("all-ebooks")

      setIsAddOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error("Error adding ebook:", err)
      alert("Gagal menambahkan e-book. Cek console untuk detail.")
    } finally {
      setIsLoading(false)
    }
  }

  // Update ebook (upload file baru jika dipilih)
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEbook) return
    setIsLoading(true)

    try {
      let documentUrl = formData.document_url
      let thumbnailUrl = formData.thumbnail_url

      if (formData.documentFile) {
        documentUrl = await uploadToStorage(formData.documentFile, "documents")
      }

      if (formData.thumbnailFile) {
        thumbnailUrl = await uploadToStorage(formData.thumbnailFile, "thumbnails")
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        author: formData.author || null,
        document_url: documentUrl,
        thumbnail_url: thumbnailUrl || null,
        category: formData.category || null,
        estimated_read_minutes: formData.estimated_read_minutes
          ? parseInt(formData.estimated_read_minutes, 10)
          : null,
        is_published: formData.is_published,
      }

      const { error } = await supabase.from("ebooks").update(payload).eq("id", editingEbook.id)
      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-ebooks")
      mutate("all-ebooks")

      resetForm()
      router.refresh()
    } catch (err) {
      console.error("Error updating ebook:", err)
      alert("Gagal mengupdate e-book. Cek console untuk detail.")
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
    } catch (err) {
      console.error("Error deleting ebook:", err)
      alert("Gagal menghapus e-book.")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (ebook: Ebook) => {
    setEditingEbook(ebook)
    setFormData({
      title: ebook.title,
      description: ebook.description,
      author: ebook.author || "",
      document_url: ebook.document_url || "",
      thumbnail_url: ebook.thumbnail_url || "",
      category: ebook.category || "",
      estimated_read_minutes: ebook.estimated_read_minutes?.toString() ?? "",
      is_published: ebook.is_published,
      documentFile: null,
      thumbnailFile: null,
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
              <InputField label="Judul" id="title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
              <TextAreaField label="Deskripsi" id="description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} />
              <InputField label="Penulis" id="author" value={formData.author} onChange={(v) => setFormData({ ...formData, author: v })} />

              {/* File upload PDF */}
              <div className="space-y-2">
                <Label htmlFor="documentFile" className="text-base">Upload Dokumen (PDF)</Label>
                <input
                  id="documentFile"
                  type="file"
                  accept="application/pdf"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, documentFile: e.target.files?.[0] ?? null }))
                  }
                />
                <p className="text-sm text-gray-500">Atau biarkan kosong lalu masukkan URL jika sudah ada di storage.</p>
              </div>

              {/* File upload Thumbnail */}
              <div className="space-y-2">
                <Label htmlFor="thumbnailFile" className="text-base">Upload Thumbnail (image)</Label>
                <input
                  id="thumbnailFile"
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, thumbnailFile: e.target.files?.[0] ?? null }))
                  }
                />
                <p className="text-sm text-gray-500">Atau biarkan kosong lalu masukkan URL jika sudah ada di storage.</p>
              </div>

              <InputField label="URL Dokumen (opsional jika sudah upload)" id="document_url" value={formData.document_url} onChange={(v) => setFormData({ ...formData, document_url: v })} />
              <InputField label="URL Thumbnail (opsional jika sudah upload)" id="thumbnail_url" value={formData.thumbnail_url} onChange={(v) => setFormData({ ...formData, thumbnail_url: v })} />

              <InputField label="Kategori" id="category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} />
              <InputField label="Estimasi Waktu Baca (menit)" id="estimated_read_minutes" value={formData.estimated_read_minutes} onChange={(v) => setFormData({ ...formData, estimated_read_minutes: v })} />

              <div className="flex items-center gap-2">
                <input
                  id="is_published"
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <Label htmlFor="is_published">Publikasikan</Label>
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

      {/* List eBook */}
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
                      {ebook.estimated_read_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {ebook.estimated_read_minutes} menit
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
                          <InputField label="Judul" id="edit-title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
                          <TextAreaField label="Deskripsi" id="edit-description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} />
                          <InputField label="Penulis" id="edit-author" value={formData.author} onChange={(v) => setFormData({ ...formData, author: v })} />

                          <div className="space-y-2">
                            <Label htmlFor="edit-documentFile" className="text-base">Ganti Dokumen (PDF)</Label>
                            <input
                              id="edit-documentFile"
                              type="file"
                              accept="application/pdf"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData((prev) => ({ ...prev, documentFile: e.target.files?.[0] ?? null }))
                              }
                            />
                            <p className="text-sm text-gray-500">Biarkan kosong untuk mempertahankan dokumen lama.</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="edit-thumbnailFile" className="text-base">Ganti Thumbnail</Label>
                            <input
                              id="edit-thumbnailFile"
                              type="file"
                              accept="image/*"
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setFormData((prev) => ({ ...prev, thumbnailFile: e.target.files?.[0] ?? null }))
                              }
                            />
                            <p className="text-sm text-gray-500">Biarkan kosong untuk mempertahankan thumbnail lama.</p>
                          </div>

                          <InputField label="Kategori" id="edit-category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} />
                          <InputField label="Estimasi Waktu Baca (menit)" id="edit-estimated_read_minutes" value={formData.estimated_read_minutes} onChange={(v) => setFormData({ ...formData, estimated_read_minutes: v })} />

                          <div className="flex items-center gap-2">
                            <input id="edit-is_published" type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} />
                            <Label htmlFor="edit-is_published">Publikasikan</Label>
                          </div>

                          <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                              Batal
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                              {isLoading ? "Menyimpan..." : "Update"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Button variant="destructive" size="icon" onClick={() => handleDelete(ebook.id)} disabled={isLoading}>
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

/* Helper UI components dengan typing yang jelas */
interface InputFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

function InputField({ label, id, value, onChange, required = false }: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base">
        {label}
      </Label>
      <Input id={id} value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} required={required} className="text-base" />
    </div>
  )
}

interface TextAreaFieldProps {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
}

function TextAreaField({ label, id, value, onChange }: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base">
        {label}
      </Label>
      <Textarea id={id} value={value} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} rows={3} className="text-base" />
    </div>
  )
}
