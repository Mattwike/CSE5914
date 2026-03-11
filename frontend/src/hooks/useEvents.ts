import { useEffect, useState } from 'react'
import * as eventsService from '../services/events'
import type { EventItem } from '../services/events'

export default function useEvents(userId?: string) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await eventsService.getEvents(userId)
        if (mounted) setEvents(data || [])
      } catch (err: any) {
        setError(err?.message || 'Failed to load events')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [userId])

  return { events, loading, error }
}
