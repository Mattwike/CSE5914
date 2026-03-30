import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { EventGrid, EventFilters, EventHero } from '../components/events'
import { Input, Button, Heading } from '../components/ui'
import '../styles/events.css'

type EventItem = {
  id: string
  title: string
  date: string
  location?: string
  description?: string
}

// Mock data: 25 items to demo pagination
const MOCK_EVENTS: EventItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: String(i + 1),
  title: `Event #${i + 1}`,
  date: new Date(Date.now() + i * 86400000).toISOString(),
  location: i % 3 === 0 ? 'Auditorium' : i % 3 === 1 ? 'Room 101' : 'Online',
  description: `This is a short description for event ${i + 1}.`,
}))

const PAGE_SIZE = 10

const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // Filter logic lives in page (not in EventGrid)
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return MOCK_EVENTS.filter((e) => {
      if (s && !e.title.toLowerCase().includes(s)) return false
      if (location && e.location !== location) return false
      return true
    })
  }, [search, location])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  // simulate a short loading delay whenever filters/page change
  React.useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [search, location, page])

  const locations = useMemo(() => Array.from(new Set(MOCK_EVENTS.map((e) => e.location).filter(Boolean) as string[])), [])

  const navigate = useNavigate()

  const handleEventClick = (id: string) => navigate(`/events/${id}`)

  return (
    <PageWrapper>
      <MainContent>
        <div className="stack-vertical">
          <EventHero />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Heading level={1}>Events</Heading>
            <div>
              <Button onClick={() => navigate('/events/create')}>Create Event</Button>
            </div>
          </div>

          <EventFilters search={search} setSearch={(s) => { setSearch(s); setPage(1) }} location={location} setLocation={(l) => { setLocation(l); setPage(1) }} locations={locations} />

          <EventGrid events={paginated} loading={loading} onEventClick={handleEventClick} />

          <div className="flex-center pagination">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
            <div>Page {page} of {totalPages}</div>
            <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default EventsPage
