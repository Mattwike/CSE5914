import React from 'react'
import EventCard from './EventCard'
import type { EventItem } from './EventCard'
import '../../styles/events.css'

type Props = {
  events: EventItem[]
  onEventClick?: (id: string) => void
  className?: string
}

const EventGrid: React.FC<Props> = ({ events, onEventClick, className = '' }) => {
  return (
    <section className={`events-grid ${className}`.trim()}>
      {events.map((e) => (
        <EventCard key={e.id} event={e} onView={onEventClick} />
      ))}
    </section>
  )
}

export default EventGrid
