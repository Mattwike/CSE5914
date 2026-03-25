import { request } from './api'

export interface LoginResponse { message: string }

export async function login(email: string, password: string) {
  return request('/user/login', { method: 'POST', body: { email, password } }) as Promise<LoginResponse>
}

export async function register(email: string, password: string) {
  // Backend endpoint is `/user/create_account`
  return request('/user/create_account', { method: 'POST', body: { email, password } })
}

export async function resendVerification(email: string) {
  return request('/user/resend_verification_email', { method: 'POST', body: { email } })
}

export async function verifyToken(token: string, user_email: string) {
  return request(`/user/verify_token?token=${encodeURIComponent(token)}&user_email=${encodeURIComponent(user_email)}`)
}
