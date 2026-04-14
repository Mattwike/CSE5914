import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { EventGrid, EventFilters, EventHero } from '../components/events'
import { Button, Heading, Text } from '../components/ui'
import { useAuthContext } from '../context/AuthContext'
import { request } from '../services/api'
import '../styles/events.css'
import useEvents from '../hooks/useEvents'
import type { EventItem } from '../services/events'
import { mapCategory } from '../utils/categoryMap'

const PAGE_SIZE = 12

const AllEventsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const { events, loading } = useEvents()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')

  // Filter logic
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return (events || []).filter((e) => {
      if (s && !String(e.title).toLowerCase().includes(s)) return false
      if (location && e.location !== location) return false
      // If category param is set, filter by category
      if (categoryParam) {
        const raw = (e as any).category
        const mapped = mapCategory(raw)
        if (String(mapped).toLowerCase() !== String(categoryParam).toLowerCase()) {
          return false
        }
      }
      return true
    })
  }, [search, location, events, categoryParam])

  const locations = useMemo(
    () => Array.from(new Set((events || []).map((e) => e.location).filter(Boolean) as string[])),
    [events]
  )

  // Pagination
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered])

  const eventsToShow = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [page, filtered])

  const handleEventClick = (id: string) => navigate(`/events/${id}`)

  return (
    <PageWrapper>
      <MainContent>
        <div className="stack-vertical">
          <EventHero />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Heading level={1}>{categoryParam ? `${categoryParam} Events` : 'All Events'}</Heading>
            <Button onClick={() => navigate('/events')}>Back to Events</Button>
          </div>

          <EventFilters
            search={search}
            setSearch={(s) => {
              setSearch(s)
              setPage(1)
            }}
            location={location}
            setLocation={(l) => {
              setLocation(l)
              setPage(1)
            }}
            locations={locations}
          />

          <div style={{ marginTop: '24px', marginBottom: '24px' }}>
            <Text as="p" style={{ color: '#666', marginBottom: '16px' }}>
              Showing {filtered.length === 0 ? '0' : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} events
            </Text>
            <EventGrid events={eventsToShow} loading={loading} onEventClick={handleEventClick} />
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginTop: '32px', marginBottom: '32px' }}>
              <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Text as="p" style={{ minWidth: '100px', textAlign: 'center' }}>
                Page {page} of {totalPages}
              </Text>
              <Button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next
              </Button>
            </div>
          )}
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default AllEventsPage
