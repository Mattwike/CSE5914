import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { EventGrid, EventFilters, EventHero } from '../components/events'
import { Button, Heading } from '../components/ui'
import '../styles/events.css'
import useEvents from '../hooks/useEvents'
type EventItem = {
  id: string
  title: string
  date: string
  location?: string
  description?: string
}

const PAGE_SIZE = 10

const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const { events, loading, error } = useEvents()

  // Filter logic lives in page (not in EventGrid)
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return (events || []).filter((e) => {
      if (s && !String(e.title).toLowerCase().includes(s)) return false
      if (location && e.location !== location) return false
      return true
    })
  }, [search, location, events])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const locations = useMemo(() => Array.from(new Set((events || []).map((e) => e.location).filter(Boolean) as string[])), [events])

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
