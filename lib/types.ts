export interface Profile {
  id: string
  full_name: string
  date_of_birth: string | null
  gender: string | null
  height_cm: number | null
  weight_kg: number | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface LearningModule {
  id: string
  title: string
  description: string
  module_order: number
  learning_objectives: string[]
  estimated_duration_minutes: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface ModuleContent {
  id: string
  module_id: string
  title: string
  content_type: "ebook" | "video" | "game" | "quiz"
  content_order: number
  content_data: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  content_id: string
  completed: boolean
  score: number | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface BMIHistory {
  id: string
  user_id: string
  height_cm: number
  weight_kg: number
  bmi_value: number
  bmi_category: string
  created_at: string
}

export interface Glossary {
  id: string
  term: string
  definition: string
  category: string | null
  example: string | null
  created_at: string
  updated_at: string
}

export interface Ebook {
  id: string
  title: string
  description: string
  author: string | null
  document_url: string
  thumbnail_url: string | null
  category: string | null
  estimated_read_minutes: number | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface EducationalVideo {
  id: string
  title: string
  description: string
  youtube_url: string
  thumbnail_url: string | null
  duration_minutes: number | null
  category: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface EbookProgress {
  id: string
  user_id: string
  ebook_id: string
  completed: boolean
  last_page: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface VideoProgress {
  id: string
  user_id: string
  video_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}
