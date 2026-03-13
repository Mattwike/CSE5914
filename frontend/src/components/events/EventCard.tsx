import React from 'react'
import { Card, Heading, Text, Button } from '../ui'
import '../../styles/events.css'

export type EventItem = {
  id: string
  title: string
  date: string
  location?: string
  description?: string
}

type Props = {
  event: EventItem
  onView?: (id: string) => void
  className?: string
}

const EventCard: React.FC<Props> = ({ event, onView, className = '' }) => {
  const { id, title, date, location, description } = event
  const displayDate = new Date(date).toLocaleString()

  return (
    <Card className={`event-card ${className}`.trim()}>
      <div className="event-card-header">
        <Heading level={3}>{title}</Heading>
        <Text as="p" className="event-meta">{displayDate}{location ? ` · ${location}` : ''}</Text>
      </div>

      {description ? <Text as="div" className="event-desc">{description}</Text> : null}

      <div className="event-actions">
        <Button onClick={() => onView?.(id)}>View Event</Button>
      </div>
    </Card>
  )
}

export default EventCard
