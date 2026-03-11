import { request } from './api'

export interface LoginResponse { message: string }

export async function login(email: string, password: string) {
  return request('/user/login', { method: 'POST', body: { email, password } }) as Promise<LoginResponse>
}

export async function register(email: string, password: string) {
  return request('/user/create', { method: 'POST', body: { email, password } })
}

export async function resendVerification(email: string) {
  return request('/user/auth/resend', { method: 'POST', body: { email } })
}

export async function verifyToken(token: string, user_email: string) {
  return request(`/user/auth/verify?token=${encodeURIComponent(token)}&user_email=${encodeURIComponent(user_email)}`)
}
