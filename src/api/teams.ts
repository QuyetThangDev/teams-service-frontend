import http from '@/utils/http'
import type { Team } from '@/types/team'

interface TeamCreate {
  name: string
  description?: string
}

interface TeamMember {
  email: string
  role: string
}

export async function getTeams() {
  const response = await http.get<Team[]>('/teams')
  return response.data
}

export async function createTeam(obj: TeamCreate) {
  console.log(obj)
  return await http.post('/teams', obj)
}

export async function addMember(obj: TeamMember) {
  console.log(obj)
}
