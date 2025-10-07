"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Plus, Edit, Trash2, Video, Youtube, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import type { VideoType } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"

// ====== Helper functions ======
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

function getYouTubeThumbnail(videoId: string, quality: "maxres" | "hq" = "maxres"): string {
  const map = { maxres: "maxresdefault", hq: "hqdefault" }
  return `https://img.youtube.com/vi/${videoId}/${map[quality]}.jpg`
}

const initialForm = {
  title: "",
  description: "",
  category: "",
}

// ====== Component ======
export function VideoManagerFixed({ videos }: { videos: VideoType[] }) {
  const supabase = createClient()
  const router = useRouter()

  // form states
  const [formData, setFormData] = useState(initialForm)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [useAutoThumbnail, setUseAutoThumbnail] = useState(true)
  const [thumbnailPreview, setThumbnailPreview] = useState("")
  const [youtubeError, setYoutubeError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null)

  // ====== Handlers ======
  const handleFormChange = useCallback(
    (field: keyof typeof initialForm, value: string) =>
      setFormData((prev) => ({ ...prev, [field]: value })),
    []
  )

  const resetForm = useCallback(() => {
    setFormData(initialForm)
    setYoutubeUrl("")
    setThumbnailUrl("")
    setThumbnailPreview("")
    setYoutubeError("")
    setUseAutoThumbnail(true)
    setEditingVideo(null)
  }, [])

  // ====== Auto Thumbnail Logic ======
  useEffect(() => {
    if (!useAutoThumbnail || !youtubeUrl) return

    const timeout = setTimeout(() => {
      const videoId = extractYouTubeId(youtubeUrl)
      if (videoId) {
        const thumb = getYouTubeThumbnail(videoId, "maxres")
        setThumbnailPreview(thumb)
        setThumbnailUrl(thumb)
        setYoutubeError("")
      } else {
        setThumbnailPreview("")
        setYoutubeError("URL YouTube tidak valid. Format: https://www.youtube.com/watch?v=...")
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [youtubeUrl, useAutoThumbnail])

  // ====== CRUD ======
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = extractYouTubeId(youtubeUrl)
    if (!videoId) {
      setYoutubeError("URL YouTube tidak valid")
      return
    }

    setIsLoading(true)
    try {
      const newData = { ...formData, youtube_url: youtubeUrl, thumbnail_url: thumbnailUrl }
      const { error } = await supabase.from("educational_videos").insert([newData])
      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-videos")
      mutate("all-videos")
      setIsAddOpen(false)
      resetForm()
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Gagal menambahkan video.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingVideo) return

    const videoId = extractYouTubeId(youtubeUrl)
    if (!videoId) {
      setYoutubeError("URL YouTube tidak valid")
      return
    }

    setIsLoading(true)
    try {
      const updatedData = { ...formData, youtube_url: youtubeUrl, thumbnail_url: thumbnailUrl }
      const { error } = await supabase
        .from("educational_videos")
        .update(updatedData)
        .eq("id", editingVideo.id)
      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-videos")
      mutate("all-videos")
      resetForm()
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Gagal mengupdate video.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus video ini?")) return
    setIsLoading(true)
    try {
      const { error } = await supabase.from("educational_videos").delete().eq("id", id)
      if (error) throw error
      const { mutate } = await import("swr")
      mutate("recent-videos")
      mutate("all-videos")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Gagal menghapus video.")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (video: VideoType) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || "",
      category: video.category || "",
    })
    setYoutubeUrl(video.youtube_url)
    setThumbnailUrl(video.thumbnail_url || "")
    setThumbnailPreview(video.thumbnail_url || "")
    setUseAutoThumbnail(true)
  }

  // ====== Form Component ======
  const VideoForm = ({
    onSubmit,
    isEdit = false,
  }: {
    onSubmit: (e: React.FormEvent) => void
    isEdit?: boolean
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Judul */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base">
          Judul Video
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleFormChange("title", e.target.value)}
          placeholder="Masukkan judul video"
          required
        />
      </div>

      {/* URL YouTube */}
      <div className="space-y-2">
        <Label htmlFor="youtube_url" className="text-base flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-600" />
          URL YouTube
        </Label>
        <Input
          id="youtube_url"
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
        {youtubeError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{youtubeError}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Thumbnail */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Thumbnail</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="auto-thumb" className="text-sm cursor-pointer">
              {useAutoThumbnail ? "Otomatis dari YouTube" : "Manual"}
            </Label>
            <Switch id="auto-thumb" checked={useAutoThumbnail} onCheckedChange={setUseAutoThumbnail} />
          </div>
        </div>

        {!useAutoThumbnail && (
          <Input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="https://..."
          />
        )}

        {thumbnailPreview && (
          <div className="rounded-lg border border-dashed p-2">
            <img src={thumbnailPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            <p className="text-xs text-center text-muted-foreground mt-2">Preview Thumbnail</p>
          </div>
        )}
      </div>

      {/* Deskripsi */}
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleFormChange("description", e.target.value)}
          placeholder="Jelaskan isi video..."
          rows={3}
        />
      </div>

      {/* Kategori */}
      <div className="space-y-2">
        <Label htmlFor="category">Kategori</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => handleFormChange("category", e.target.value)}
          placeholder="mis. Nutrisi, Olahraga, Pencegahan"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => (isEdit ? resetForm() : setIsAddOpen(false))}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : isEdit ? "Update Video" : "Tambah Video"}
        </Button>
      </div>
    </form>
  )

  // ====== RENDER ======
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kelola Video Pembelajaran</h2>
          <p className="text-muted-foreground">Tambah dan kelola video YouTube untuk pembelajaran diabetes</p>
        </div>
        <Dialog
          open={isAddOpen}
          onOpenChange={(o) => {
            setIsAddOpen(o)
            if (!o) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-5 w-5" />
              Tambah Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Video YouTube</DialogTitle>
              <DialogDescription>Masukkan URL video YouTube, thumbnail akan otomatis terisi.</DialogDescription>
            </DialogHeader>
            <VideoForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">Belum ada video. Tambahkan yang pertama!</p>
            </CardContent>
          </Card>
        ) : (
          videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    {video.thumbnail_url && (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="h-24 w-40 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl">{video.title}</CardTitle>
                      <p className="mt-2 text-gray-600 line-clamp-2">{video.description}</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {video.category && (
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                            {video.category}
                          </span>
                        )}
                        <a
                          href={video.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 text-sm hover:underline flex items-center gap-1"
                        >
                          <Youtube className="h-4 w-4" />
                          Tonton di YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={editingVideo?.id === video.id} onOpenChange={(o) => !o && resetForm()}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(video)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Video</DialogTitle>
                          <DialogDescription>Perbarui informasi video pembelajaran</DialogDescription>
                        </DialogHeader>
                        <VideoForm onSubmit={handleEdit} isEdit />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(video.id)}
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
