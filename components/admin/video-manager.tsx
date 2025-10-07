"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
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

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Utility functions moved outside component
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

const getYouTubeThumbnail = (videoId: string, quality: "maxres" | "hq" | "mq" | "sd" = "maxres"): string => {
  const qualityMap = {
    maxres: "maxresdefault",
    hq: "hqdefault",
    mq: "mqdefault",
    sd: "sddefault",
  }
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}

interface VideoFormState {
  title: string
  description: string
  youtube_url: string
  thumbnail_url: string
  category: string
}

const initialFormState: VideoFormState = {
  title: "",
  description: "",
  youtube_url: "",
  thumbnail_url: "",
  category: "",
}

interface VideoManagerProps {
  videos: VideoType[]
}

// KOMPONEN FORM DIPISAHKAN DI LUAR - INI KUNCI SOLUSINYA
interface VideoFormProps {
  formData: VideoFormState
  onFieldChange: (field: keyof VideoFormState, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  isLoading: boolean
  isEdit: boolean
  useAutoThumbnail: boolean
  onAutoThumbnailChange: (checked: boolean) => void
  thumbnailPreview: string
  youtubeError: string
  onThumbnailError: () => void
}

function VideoFormComponent({
  formData,
  onFieldChange,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
  useAutoThumbnail,
  onAutoThumbnailChange,
  thumbnailPreview,
  youtubeError,
  onThumbnailError
}: VideoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-title" : "title"} className="text-base">
          Judul Video
        </Label>
        <Input
          id={isEdit ? "edit-title" : "title"}
          value={formData.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
          required
          className="text-base"
          placeholder="Masukkan judul video"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-youtube_url" : "youtube_url"} className="text-base flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-600" />
          URL YouTube
        </Label>
        <Input
          id={isEdit ? "edit-youtube_url" : "youtube_url"}
          type="url"
          value={formData.youtube_url}
          onChange={(e) => onFieldChange("youtube_url", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          required
          className="text-base"
        />
        {youtubeError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{youtubeError}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-base">Thumbnail</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor={isEdit ? "edit-auto-thumbnail" : "auto-thumbnail"} className="text-sm text-muted-foreground cursor-pointer">
              {useAutoThumbnail ? "Otomatis dari YouTube" : "Manual"}
            </Label>
            <Switch 
              id={isEdit ? "edit-auto-thumbnail" : "auto-thumbnail"}
              checked={useAutoThumbnail} 
              onCheckedChange={onAutoThumbnailChange}
            />
          </div>
        </div>

        {!useAutoThumbnail && (
          <Input
            id={isEdit ? "edit-thumbnail_url" : "thumbnail_url"}
            type="url"
            value={formData.thumbnail_url}
            onChange={(e) => onFieldChange("thumbnail_url", e.target.value)}
            placeholder="https://... (URL thumbnail custom)"
            className="text-base"
          />
        )}

        {thumbnailPreview && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-2">
            <img
              src={thumbnailPreview}
              alt="Preview thumbnail"
              className="w-full h-48 object-cover rounded-lg"
              onError={onThumbnailError}
            />
            <p className="text-xs text-center text-muted-foreground mt-2">Preview Thumbnail</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-description" : "description"} className="text-base">
          Deskripsi
        </Label>
        <Textarea
          id={isEdit ? "edit-description" : "description"}
          value={formData.description}
          onChange={(e) => onFieldChange("description", e.target.value)}
          rows={3}
          className="text-base"
          placeholder="Jelaskan isi video..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={isEdit ? "edit-category" : "category"} className="text-base">
          Kategori
        </Label>
        <Input
          id={isEdit ? "edit-category" : "category"}
          value={formData.category}
          onChange={(e) => onFieldChange("category", e.target.value)}
          placeholder="mis. Nutrisi, Olahraga, Pencegahan"
          className="text-base"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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
}

export function VideoManager({ videos }: VideoManagerProps) {
  const router = useRouter()
  const supabase = createClient()

  // Form and UI State
  const [formData, setFormData] = useState<VideoFormState>(initialFormState)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [useAutoThumbnail, setUseAutoThumbnail] = useState(true)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [youtubeError, setYoutubeError] = useState<string>("")

  // Debounce YouTube URL changes
  const debouncedYoutubeUrl = useDebounce(formData.youtube_url, 500)

  // Handler yang stabil dengan useCallback
  const handleFieldChange = useCallback((field: keyof VideoFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAutoThumbnailChange = useCallback((checked: boolean) => {
    setUseAutoThumbnail(checked)
  }, [])

  const handleThumbnailError = useCallback(() => {
    setThumbnailPreview("")
  }, [])

  // YouTube URL validation effect
  useEffect(() => {
    if (debouncedYoutubeUrl && useAutoThumbnail) {
      const videoId = extractYouTubeId(debouncedYoutubeUrl)
      if (videoId) {
        const autoThumbnail = getYouTubeThumbnail(videoId, "maxres")
        setThumbnailPreview(autoThumbnail)
        setFormData(prev => ({ ...prev, thumbnail_url: autoThumbnail }))
        setYoutubeError("")
      } else if (debouncedYoutubeUrl.length > 5) {
        setYoutubeError("URL YouTube tidak valid. Gunakan format: https://www.youtube.com/watch?v=...")
        setThumbnailPreview("")
      }
    }
  }, [debouncedYoutubeUrl, useAutoThumbnail])

  // Custom thumbnail preview effect
  useEffect(() => {
    if (!useAutoThumbnail && formData.thumbnail_url) {
      setThumbnailPreview(formData.thumbnail_url)
    }
  }, [formData.thumbnail_url, useAutoThumbnail])

  const resetForm = useCallback(() => {
    setFormData(initialFormState)
    setEditingVideo(null)
    setUseAutoThumbnail(true)
    setThumbnailPreview("")
    setYoutubeError("")
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const videoId = extractYouTubeId(formData.youtube_url)
    if (!videoId) {
      setYoutubeError("URL YouTube tidak valid")
      return
    }

    setIsLoading(true)

    try {
      if (editingVideo) {
        const { error } = await supabase
          .from("educational_videos")
          .update(formData)
          .eq("id", editingVideo.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("educational_videos")
          .insert([formData])
        if (error) throw error
      }

      const { mutate } = await import("swr")
      mutate("recent-videos")
      mutate("all-videos")

      resetForm()
      setIsAddOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving video:", error)
      alert(editingVideo ? "Gagal mengupdate video" : "Gagal menambahkan video")
    } finally {
      setIsLoading(false)
    }
  }, [formData, editingVideo, supabase, router, resetForm])

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Yakin ingin menghapus video ini?")) return

    setIsLoading(true)

    try {
      const { error } = await supabase.from("educational_videos").delete().eq("id", id)
      if (error) throw error

      const { mutate } = await import("swr")
      mutate("recent-videos")
      mutate("all-videos")

      router.refresh()
    } catch (error) {
      console.error("Error deleting video:", error)
      alert("Gagal menghapus video")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, router])

  const openEditDialog = useCallback((video: VideoType) => {
    setEditingVideo(video)
    setFormData({
      title: video.title,
      description: video.description || "",
      youtube_url: video.youtube_url,
      thumbnail_url: video.thumbnail_url || "",
      category: video.category || "",
    })
    const videoId = extractYouTubeId(video.youtube_url)
    const autoThumbnail = videoId ? getYouTubeThumbnail(videoId, "maxres") : ""
    setUseAutoThumbnail(video.thumbnail_url === autoThumbnail || !video.thumbnail_url)
    setThumbnailPreview(video.thumbnail_url || "")
  }, [])

  const handleCancelAdd = useCallback(() => {
    setIsAddOpen(false)
    resetForm()
  }, [resetForm])

  const handleCancelEdit = useCallback(() => {
    resetForm()
  }, [resetForm])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kelola Video Pembelajaran</h2>
          <p className="text-muted-foreground mt-1">Tambah dan kelola video YouTube untuk pembelajaran diabetes</p>
        </div>
        <Dialog
          open={isAddOpen}
          onOpenChange={(open) => {
            setIsAddOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="lg" className="text-base">
              <Plus className="mr-2 h-5 w-5" />
              Tambah Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Tambah Video YouTube</DialogTitle>
              <DialogDescription className="text-base">
                Masukkan URL video YouTube dan informasi akan otomatis terisi
              </DialogDescription>
            </DialogHeader>
            <VideoFormComponent
              formData={formData}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
              onCancel={handleCancelAdd}
              isLoading={isLoading}
              isEdit={false}
              useAutoThumbnail={useAutoThumbnail}
              onAutoThumbnailChange={handleAutoThumbnailChange}
              thumbnailPreview={thumbnailPreview}
              youtubeError={youtubeError}
              onThumbnailError={handleThumbnailError}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Video className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Belum ada video. Tambahkan yang pertama!</p>
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
                        className="h-24 w-40 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl">{video.title}</CardTitle>
                      <p className="mt-2 text-base text-gray-600 dark:text-gray-400 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {video.category && (
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                            {video.category}
                          </span>
                        )}
                        <a
                          href={video.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline font-medium"
                        >
                          <Youtube className="h-4 w-4" />
                          Tonton di YouTube
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Dialog open={editingVideo?.id === video.id} onOpenChange={(open) => !open && resetForm()}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(video)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl">Edit Video</DialogTitle>
                          <DialogDescription className="text-base">
                            Update informasi video pembelajaran
                          </DialogDescription>
                        </DialogHeader>
                        <VideoFormComponent
                          formData={formData}
                          onFieldChange={handleFieldChange}
                          onSubmit={handleSubmit}
                          onCancel={handleCancelEdit}
                          isLoading={isLoading}
                          isEdit={true}
                          useAutoThumbnail={useAutoThumbnail}
                          onAutoThumbnailChange={handleAutoThumbnailChange}
                          thumbnailPreview={thumbnailPreview}
                          youtubeError={youtubeError}
                          onThumbnailError={handleThumbnailError}
                        />
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