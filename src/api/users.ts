import http from '@/utils/http'
import type { UserInfo } from '@/types/user'

export async function getCurrentUser() {
  return http.get<UserInfo>('/users/me')
}

export async function getUsers(params: { enabled?: boolean; page: number; pageSize: number }) {
  const q = {
    enabled: params.enabled,
    page: params.page,
    page_size: params.pageSize
  }
  return http.get('/users', { params: q })
}

export async function changePassword(obj: { old_password: string; new_password: string }) {
  console.log(obj)
  return await http.put('/users/me/change_pwd', obj)
}
