import React from 'react'
import { useParams } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Button, LazyImage } from '../components/ui'
import EventHero from '../components/events/EventHero'
import '../styles/events.css'

type EventItem = {
  id: string
  title: string
  date: string
  location?: string
  description?: string
}

const makeMockEvent = (id?: string): EventItem => ({
  id: id || '0',
  title: `Event #${id}`,
  date: new Date().toISOString(),
  location: 'Auditorium',
  description: `Detailed information for event ${id}. This area will later be populated from the backend.`
})

const EventDetail: React.FC = () => {
  const { id } = useParams()
  const event = makeMockEvent(id)

  const attendees = Math.floor(Math.random() * 60) + 5
  const capacity = attendees + (Math.floor(Math.random() * 40) + 5)
  const spotsLeft = capacity - attendees

  return (
    <PageWrapper>
      <MainContent>
        <EventHero />

        <div className="detail-card detail-card--centered">
          <Heading level={1} className="detail-title">{event.title}</Heading>

          <div className="detail-thumb-wrap">
            <LazyImage src="/block.jpg" alt={event.title} width={640} height={320} className="detail-thumb" />
          </div>

          <div className="detail-meta">
            <div className="detail-stats">{attendees} joined · {spotsLeft} spots left</div>
            <div className="detail-location">{event.location}</div>
          </div>

          <div className="detail-description">
            <Text as="div">{event.description}</Text>
          </div>

          <div className="event-actions">
            <Button onClick={() => window.history.back()}>Back</Button>
          </div>
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default EventDetail
