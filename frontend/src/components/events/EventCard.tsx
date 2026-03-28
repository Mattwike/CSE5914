import React from 'react'
import { Card, Heading, Text, Button } from '../ui'
import LazyImage from '../ui/LazyImage'
import '../../styles/events.css'

export type EventItem = {
  id: string
  title: string
  date: string
  location?: string
  description?: string
  thumbnail?: string
}

type Props = {
  event: EventItem
  onView?: (id: string) => void
  className?: string
}

const EventCard: React.FC<Props> = ({ event, onView, className = '' }) => {
  const { id, title, date, location, description, thumbnail } = event
  const displayDate = new Date(date).toLocaleString()
  const thumb = thumbnail || '/block.jpg'

  return (
    <Card className={`event-card ${className}`.trim()} aria-labelledby={`event-title-${id}`}>
      <div className="event-card-media">
        <LazyImage src={thumb} alt={`${title} thumbnail`} width={320} height={180} className="event-card-thumb" />
      </div>

      <div className="event-card-body">
        <div className="event-card-header">
          <Heading level={3} id={`event-title-${id}`}>{title}</Heading>
          <Text as="p" className="event-meta">{displayDate}{location ? ` · ${location}` : ''}</Text>
        </div>

        {description ? <Text as="div" className="event-desc">{description}</Text> : null}

        <div className="event-actions">
          <Button onClick={() => onView?.(id)}>View Event</Button>
        </div>
      </div>
    </Card>
  )
}

export default EventCard
