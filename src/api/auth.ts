import http from '@/utils/http'

export async function login(user: { email: string; password: string }) {
  return await http.post('/auth/login', user)
}

export async function register(user: {
  email: string
  password: string
  first_name: string
  last_name: string
}) {
  return await http.post('/auth/register', user)
}

export function logout() {
  return http.post('/auth/logout')
}

export async function forgotPassword(email: string) {
  return await http.post('/auth/forgot_pwd', { email })
}

export async function resetPassword(obj: { token: string; new_password: string }) {
  console.log(obj)
  return await http.post('/auth/reset_pwd', obj)
}

export async function updateUser(obj: { first_name?: string; last_name?: string }) {
  return await http.patch('/users/me', obj)
}

export async function deleteUser() {
  console.log('User deleted')
  // return await http.delete('/users/me')
}
