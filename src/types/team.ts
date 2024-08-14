import type { UserInfo } from './user'

export interface Team {
  id: string
  name: string
  description?: string
  default: boolean
  slug: string
  created_at: Date
  updated_at?: Date
}

export interface TeamRole {
  name: string
}

export interface TeamMember {
  id: string
  user: UserInfo
  team: Team
  role: TeamRole
  created_at: Date
  updated_at?: Date
}
