import React from 'react'
import { Card, Heading, Text } from '../ui'
import LazyImage from '../ui/LazyImage'
import '../../styles/events.css'

type Props = {
  id: string
  title: string
  date: string
  thumbnail?: string
  onClick?: (id: string) => void
}

const EventListItem: React.FC<Props> = ({ id, title, date, thumbnail, onClick }) => {
  const displayDate = new Date(date).toLocaleString()
  const thumb = thumbnail || '/block.jpg'
  return (
    <Card className="event-list-item">
      <div className="event-list-inner">
        <div className="event-list-thumb-wrap">
          <LazyImage src={thumb} alt={`${title} thumbnail`} width={120} height={72} className="event-list-thumb" />
        </div>
        <div className="event-list-content">
          <Heading level={3}>{title}</Heading>
          <Text as="p" className="event-meta">{displayDate}</Text>
        </div>
        <div className="event-list-actions">
          <button className="btn btn--ghost" onClick={() => onClick?.(id)}>View</button>
        </div>
      </div>
    </Card>
  )
}

export default EventListItem
