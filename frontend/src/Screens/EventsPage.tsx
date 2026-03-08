import React, { useMemo, useState } from 'react'
import { PageWrapper } from '../components/layout'
import { EventGrid } from '../components/events'
import { Input, Button } from '../components/ui'
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

  const locations = useMemo(() => Array.from(new Set(MOCK_EVENTS.map((e) => e.location).filter(Boolean) as string[])), [])

  return (
    <PageWrapper>
      <div className="stack-vertical">
        <h1>Events</h1>

        <div className="grid" style={{ gridTemplateColumns: '1fr 220px', gap: '12px' } as any}>
          <div>
            <Input placeholder="Search events" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
          <div>
            <select className="input" value={location} onChange={(e) => { setLocation(e.target.value); setPage(1) }}>
              <option value="">All locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <EventGrid events={paginated} />

        <div className="flex-center" style={{ gap: '12px' } as any}>
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <div>Page {page} of {totalPages}</div>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      </div>
    </PageWrapper>
  )
}

export default EventsPage
