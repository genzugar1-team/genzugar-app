"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { Glossary } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface GlossaryManagerProps {
  terms: Glossary[]
}

export function GlossaryManager({ terms }: GlossaryManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    term: "",
    definition: "",
    category: "",
    example: "",
  })
  const router = useRouter()

  const resetForm = () => {
    setFormData({ term: "", definition: "", category: "", example: "" })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    const supabase = createClient()

    if (editingId) {
      await supabase
        .from("glossary")
        .update({
          term: formData.term,
          definition: formData.definition,
          category: formData.category || null,
          example: formData.example || null,
        })
        .eq("id", editingId)
    } else {
      await supabase.from("glossary").insert({
        term: formData.term,
        definition: formData.definition,
        category: formData.category || null,
        example: formData.example || null,
      })
    }

    resetForm()
    router.refresh()
  }

  const handleEdit = (term: Glossary) => {
    setFormData({
      term: term.term,
      definition: term.definition,
      category: term.category || "",
      example: term.example || "",
    })
    setEditingId(term.id)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus istilah ini?")) return

    const supabase = createClient()
    await supabase.from("glossary").delete().eq("id", id)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {(isAdding || editingId) && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">{editingId ? "Edit Istilah" : "Tambah Istilah Baru"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="term" className="text-base font-semibold">
                Istilah
              </Label>
              <Input
                id="term"
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="h-12 text-base"
                placeholder="Contoh: Diabetes"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="definition" className="text-base font-semibold">
                Definisi
              </Label>
              <Textarea
                id="definition"
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                className="min-h-24 text-base"
                placeholder="Jelaskan definisi istilah..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-semibold">
                Kategori (Opsional)
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="h-12 text-base"
                placeholder="Contoh: Penyakit, Gejala, Pengobatan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="example" className="text-base font-semibold">
                Contoh (Opsional)
              </Label>
              <Textarea
                id="example"
                value={formData.example}
                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                className="min-h-20 text-base"
                placeholder="Berikan contoh penggunaan..."
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="h-12 flex-1 text-base">
                <Save className="mr-2 h-5 w-5" />
                Simpan
              </Button>
              <Button onClick={resetForm} variant="outline" className="h-12 flex-1 text-base bg-transparent">
                <X className="mr-2 h-5 w-5" />
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isAdding && !editingId && (
        <Button onClick={() => setIsAdding(true)} size="lg" className="text-base">
          <Plus className="mr-2 h-5 w-5" />
          Tambah Istilah Baru
        </Button>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {terms.map((term) => (
          <Card key={term.id} className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{term.term}</CardTitle>
                    {term.category && <Badge variant="secondary">{term.category}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(term)} className="bg-transparent">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(term.id)}
                    className="bg-transparent text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{term.definition}</p>
              {term.example && (
                <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Contoh:</p>
                  <p className="mt-1 text-base leading-relaxed text-gray-700 dark:text-gray-300">{term.example}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
