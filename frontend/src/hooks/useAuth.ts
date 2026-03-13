import { useState } from 'react'
import * as auth from '../services/auth'

export default function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function login(email: string, password: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await auth.login(email, password)
      return res
    } catch (err: any) {
      const msg = err?.message || 'Login failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function register(email: string, password: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await auth.register(email, password)
      return res
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, register, loading, error }
}
