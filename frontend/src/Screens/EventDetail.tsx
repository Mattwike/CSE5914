import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Button, LazyImage } from '../components/ui'
import EventHero from '../components/events/EventHero'
import { useAuthContext } from '../context/AuthContext'
import '../styles/events.css'
import * as eventsService from '../services/events'
import type { EventItem } from '../services/events'

const EventDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAttending, setIsAttending] = useState(false)
  const [currentCapacity, setCurrentCapacity] = useState(0)
  const [rsvpLoading, setRsvpLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (!id) throw new Error('No event id')
        const data = await eventsService.getEventById(id)
        if (!mounted) return

        setEvent(data || null)
        setIsAttending(data?.isAttending ?? false)
        setCurrentCapacity(data?.currentCapacity ?? 0)
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

  const spotsLeft = event?.capacity != null ? event.capacity - currentCapacity : null
  const isFull = event?.capacity != null && currentCapacity >= event.capacity
  const isClosed = event?.closeDate ? new Date(event.closeDate) < new Date() : false
  const isCreator = user?.user_id === event?.createdById

  const handleJoin = async () => {
    if (!id) return
    setRsvpLoading(true)
    try {
      const res = await eventsService.joinEvent(id)
      setIsAttending(true)
      setCurrentCapacity(res.currentCapacity)
    } catch (e: any) {
      console.error('Failed to join event', e)
    } finally {
      setRsvpLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!id) return
    setRsvpLoading(true)
    try {
      const res = await eventsService.leaveEvent(id)
      setIsAttending(false)
      setCurrentCapacity(res.currentCapacity)
    } catch (e: any) {
      console.error('Failed to leave event', e)
    } finally {
      setRsvpLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return
    setRsvpLoading(true)
    try {
      await eventsService.deleteEvent(id)
      navigate('/events')
    } catch (e: any) {
      console.error('Failed to delete event', e)
    } finally {
      setRsvpLoading(false)
    }
  }

  const renderRsvpButton = () => {
    if (!event) return null

    if (isCreator) {
      return (
        <>
          <Button onClick={() => navigate(`/events/create?editEventId=${event.id}`)}>Edit Event</Button>
          <Button onClick={handleDelete} disabled={rsvpLoading}>{rsvpLoading ? 'Deleting...' : 'Delete Event'}</Button>
        </>
      )
    }
    if (isClosed) {
      return <Button disabled>Registration Closed</Button>
    }
    if (isAttending) {
      return <Button onClick={handleLeave} disabled={rsvpLoading}>{rsvpLoading ? 'Leaving...' : 'Leave Event'}</Button>
    }
    if (isFull) {
      return <Button disabled>Event is Full</Button>
    }
    return <Button onClick={handleJoin} disabled={rsvpLoading}>{rsvpLoading ? 'Joining...' : 'Join Event'}</Button>
  }

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

              {event.createdBy && (
                <div className="detail-creator">
                  <Text>
                    Created by:
                    <span
                      role="link"
                      onClick={() => navigate(`/profile/${encodeURIComponent(event.createdBy || '')}`)}
                      style={{ color: 'var(--color-primary)', cursor: 'pointer', marginLeft: 6 }}
                    >
                      {event.createdBy}
                    </span>
                  </Text>
                </div>
              )}

              <div className="detail-meta">
                <div className="detail-stats">
                  {currentCapacity} joined{event.capacity != null ? ` · ${spotsLeft} spots left` : ''}
                </div>
                <div className="detail-location">{event.location}</div>
                <div className="detail-date">{event.date ? new Date(event.date).toLocaleString() : 'TBA'}</div>
              </div>

              <div className="detail-description">
                <Text as="div">{event.description || 'No description provided.'}</Text>
              </div>

              <div className="event-actions">
                {renderRsvpButton()}
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
