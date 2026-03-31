import React from 'react'
import { AnimatedCard, Heading, Text, Button } from '../ui'
import LazyImage from '../ui/LazyImage'
import '../../styles/events.css'
import type { EventItem } from '../../services/events'

type Props = {
  event: EventItem
  onView?: (id: string) => void
  className?: string
}

const EventCard: React.FC<Props> = ({ event, onView, className = '' }) => {
  const { id, title, date, location, description, thumbnail } = event
  const displayDate = date ? new Date(date).toLocaleString() : 'TBA'
  const thumb = thumbnail || '/block.jpg'
  const thumbSrcSet = `${thumb} 640w, ${thumb} 320w`
  const thumbSizes = '(max-width: 420px) 100vw, 320px'

  return (
    <AnimatedCard className={`event-card ${className}`.trim()} aria-labelledby={`event-title-${id}`}>
      <div className="event-card-media">
        <LazyImage src={thumb} alt={`${title} thumbnail`} width={320} height={180} className="event-card-thumb" srcSet={thumbSrcSet} sizes={thumbSizes} />
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
    </AnimatedCard>
  )
}

export default EventCard
