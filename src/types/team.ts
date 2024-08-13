export interface Team {
  id: string
  name: string
  description?: string
  default: boolean
  slug: string
  created_at: Date
  updated_at?: Date
}
