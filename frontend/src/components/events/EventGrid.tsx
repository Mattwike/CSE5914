import React from 'react'
import EventCard from './EventCard'
import type { EventItem } from '../../services/events'
import EventSkeleton from './EventSkeleton'
import '../../styles/events.css'

type Props = {
  events: EventItem[]
  onEventClick?: (id: string) => void
  className?: string
  loading?: boolean
}

const EventGrid: React.FC<Props> = ({ events, onEventClick, className = '', loading = false }) => {
  if (loading) {
    // show a grid of skeletons
    return (
      <section className={`events-grid ${className}`.trim()} aria-busy="true" aria-live="polite">
        {Array.from({ length: 6 }).map((_, i) => <EventSkeleton key={i} />)}
      </section>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="empty-state">
        <p>No events match your filters.</p>
        <p>Try clearing the search or selecting a different location.</p>
      </div>
    )
  }

  return (
    <section className={`events-grid ${className}`.trim()}>
      {events.map((e) => (
        <EventCard key={e.id} event={e} onView={onEventClick} />
      ))}
    </section>
  )
}

export default EventGrid
