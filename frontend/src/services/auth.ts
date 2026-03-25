import { request } from './api'

export interface LoginResponse { message: string }

export async function login(email: string, password: string) {
  return request('/account/login', { method: 'POST', body: { email, password } })
}

export async function register(email: string, password: string) {
  return request('/account/create_account', { method: 'POST', body: { email, password } })
}

export async function resendVerification(email: string) {
  return request('/account/resend_verification_email', { method: 'POST', body: { email } })
}

export async function verifyToken(token: string, user_email: string) {
  return request(`/account/verify_token?token=${encodeURIComponent(token)}&user_email=${encodeURIComponent(user_email)}`)
}

