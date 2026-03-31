import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Button, LazyImage } from '../components/ui'
import EventHero from '../components/events/EventHero'
import '../styles/events.css'
import * as eventsService from '../services/events'

type EventItem = {
  id: string
  title: string
  date?: string | null
  location?: string
  description?: string | null
  thumbnail?: string | null
}

const EventDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (!id) throw new Error('No event id')
        const data = await eventsService.getEventById(id)
        if (!mounted) return

        // service may return raw object
        setEvent(data || null)
      } catch (e: any) {
        console.error('Failed to load event', e)
        if (mounted) setError(e?.message || 'Failed to load event')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  const attendees = Math.floor(Math.random() * 60) + 5
  const capacity = attendees + (Math.floor(Math.random() * 40) + 5)
  const spotsLeft = capacity - attendees

  return (
    <PageWrapper>
      <MainContent>
        <EventHero />

        <div className="detail-card detail-card--centered">
          {loading ? (
            <Heading level={2}>Loading…</Heading>
          ) : error ? (
            <div>
              <Heading level={2}>Error</Heading>
              <Text as="div">{error}</Text>
              <div className="event-actions">
                <Button onClick={() => navigate(-1)}>Back</Button>
              </div>
            </div>
          ) : event ? (
            <>
              <Heading level={1} className="detail-title">{event.title}</Heading>

              <div className="detail-thumb-wrap">
                <LazyImage src={event.thumbnail || '/block.jpg'} alt={event.title} width={640} height={320} className="detail-thumb" />
              </div>

              <div className="detail-meta">
                <div className="detail-stats">{attendees} joined · {spotsLeft} spots left</div>
                <div className="detail-location">{event.location}</div>
                <div className="detail-date">{event.date ? new Date(event.date).toLocaleString() : 'TBA'}</div>
              </div>

              <div className="detail-description">
                <Text as="div">{event.description || 'No description provided.'}</Text>
              </div>

              <div className="event-actions">
                <Button onClick={() => navigate(-1)}>Back</Button>
              </div>
            </>
          ) : (
            <div>
              <Heading level={2}>Event not found</Heading>
              <div className="event-actions">
                <Button onClick={() => navigate(-1)}>Back</Button>
              </div>
            </div>
          )}
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default EventDetail
