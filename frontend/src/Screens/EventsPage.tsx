import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { EventGrid, EventFilters, EventHero } from '../components/events'
import { Button, Heading, Text } from '../components/ui'
import { useAuthContext } from '../context/AuthContext'
import { request } from '../services/api'
import '../styles/events.css'
import useEvents from '../hooks/useEvents'
import type { EventItem } from '../services/events'
import { getCategories } from '../services/events'
import { getCategoryPreferences } from '../services/preferences'
import { mapCategory } from '../utils/categoryMap'

const PAGE_SIZE = 10

const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)
  const { events, loading } = useEvents()

  const { user } = useAuthContext()
  const [myEvents, setMyEvents] = useState<EventItem[]>([])
  const [myEventsLoading, setMyEventsLoading] = useState(false)

  useEffect(() => {
    if (!user?.user_id) return
    let mounted = true
    async function loadMyEvents() {
      setMyEventsLoading(true)
      try {
        const data = await request(`/events/${user!.user_id}/event`)
        if (mounted) {
          setMyEvents((data || []).map((e: any) => ({
            id: e.id,
            title: e.title,
            date: e.date || '',
            location: e.location || '',
            description: e.description || '',
            thumbnail: e.thumbnail || '',
          })))
        }
      } catch {
        if (mounted) setMyEvents([])
      } finally {
        if (mounted) setMyEventsLoading(false)
      }
    }
    loadMyEvents()
    return () => { mounted = false }
  }, [user])

  // Filter logic lives in page (not in EventGrid)
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return (events || []).filter((e) => {
      if (s && !String(e.title).toLowerCase().includes(s)) return false
      if (location && e.location !== location) return false
      return true
    })
  }, [search, location, events])

  // --- New: load categories and user preference ids to prioritize categories ---
  const [categories, setCategories] = useState<Array<{ id: string | number; name: string }>>([])
  const [preferredCategoryIds, setPreferredCategoryIds] = useState<Array<string | number>>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!user?.user_id) return
      setLoadingCategories(true)
      try {
        const [catsRes, prefsRes] = await Promise.all([
          getCategories(),
          getCategoryPreferences(user.user_id),
        ])
        if (!mounted) return
        setCategories(catsRes?.categories || [])
        setPreferredCategoryIds(prefsRes?.category_ids || [])
      } catch (err) {
        if (!mounted) return
        setCategories([])
        setPreferredCategoryIds([])
      } finally {
        if (mounted) setLoadingCategories(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [user])

  // totalPages will be computed based on remaining events (after category sections)

  const locations = useMemo(() => Array.from(new Set((events || []).map((e) => e.location).filter(Boolean) as string[])), [events])

  const navigate = useNavigate()

  const handleEventClick = (id: string) => navigate(`/events/${id}`)

  // Helper: group events by mapped canonical category name
  // track unmapped raw category values for quick debugging
  const unmappedRawCategories = new Set<string>()

  const groupByCanonicalCategory = (items: EventItem[]) => {
    const map: Record<string, EventItem[]> = {}
    const ungrouped: EventItem[] = []
    for (const ev of items) {
      // map raw category to canonical preference category; mapCategory may return null for unknowns
      const raw = (ev as any).category
      const cat = mapCategory(raw)
      // log mapping for debugging — help trace why specific events aren't ending up in sections
      // eslint-disable-next-line no-console
      console.info('EventsPage: map event->category', { id: ev.id, rawCategory: raw, mapped: cat })
      if (!cat) {
        ungrouped.push(ev)
        // log unseen raw categories once to console for mapping updates
        if (raw && !unmappedRawCategories.has(String(raw))) {
          unmappedRawCategories.add(String(raw))
          // lightweight debug output
          // eslint-disable-next-line no-console
          console.info('EventsPage: unmapped raw category:', raw)
        }
        continue
      }
      const key = String(cat).toLowerCase()
      if (!map[key]) map[key] = []
      map[key].push(ev)
    }
    // Debug: show which canonical buckets were created
    // eslint-disable-next-line no-console
    console.info('EventsPage: grouped bucket keys:', Object.keys(map))
    // Debug: if Goodale Park event present, show its mapping
    const probeId = '43963d6e-96fe-4b6a-a495-a683d332db31'
    const probe = items.find((x) => x.id === probeId)
    if (probe) {
      // eslint-disable-next-line no-console
      console.info('EventsPage: probe event found', { id: probe.id, rawCategory: (probe as any).category, mapped: mapCategory((probe as any).category) })
    }
    return { map, ungrouped }
  }

  // Helper: prioritize categories using user prefs (category ids) if available
  const prioritizeCategories = (all: Array<{ id: string | number; name: string }>, preferred: Array<string | number>) => {
    const prefSet = new Set(preferred.map(String))
    const preferredOnTop = all.filter((c) => prefSet.has(String(c.id)))
    const others = all.filter((c) => !prefSet.has(String(c.id)))
    return [...preferredOnTop, ...others]
  }

  // Compute category sections (max 4 per category) and remaining events (deduped)
  const { categorySections, remainingEvents } = useMemo(() => {
    // Diagnostic: log event counts and sample ids to ensure we have data to group
    // eslint-disable-next-line no-console
    console.info('EventsPage: diagnostics', { totalEvents: (events || []).length, filteredCount: (filtered || []).length, sampleFilteredIds: (filtered || []).slice(0, 10).map(e => e.id) })

    const groupedResult = groupByCanonicalCategory(filtered)
    const grouped = groupedResult.map
    const ungroupedEvents = groupedResult.ungrouped
    const prioritized = prioritizeCategories(categories, preferredCategoryIds)

    const selectedIds = new Set<string>()
    const sections: Array<{ title: string; events: EventItem[] }> = []
    // track canonical keys for sections we've added so we don't accidentally
    // suppress grouped buckets that match a preferred category via mapping
    const sectionKeysAdded = new Set<string>()

    // If user has preferred categories, render a section for each preferred category (even if empty).
    // All events from non-preferred categories (and unmapped events) go into the final "All Events".
    const prefSet = new Set(preferredCategoryIds.map(String))
    const preferredList = prioritized.filter((c) => prefSet.has(String(c.id)))

    if (preferredList.length > 0) {
      // Render a section for each selected preference (empty sections allowed)
      // Try multiple lookup strategies so display names (eg. "Outdoors & Nature")
      // still match canonical mapped buckets (eg. "outdoors").
      const normalizeDisplayName = (s: string) => String(s || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')

      const resolveBucket = (cat: { id: string | number; name: string }) => {
        const nameKey = normalizeDisplayName(String(cat.name))
        // 1) direct normalized display-name match
        if (grouped[nameKey] && grouped[nameKey].length) return grouped[nameKey]
        // 2) try mapping the display name to a canonical key (preferred)
        const mapped = mapCategory(String(cat.name))
        if (mapped && grouped[String(mapped).toLowerCase()]) return grouped[String(mapped).toLowerCase()]
        // 3) try fallback: raw lowercased display name
        const rawName = String(cat.name).toLowerCase()
        if (grouped[rawName] && grouped[rawName].length) return grouped[rawName]

        // no matches
        // eslint-disable-next-line no-console
        console.info('EventsPage: resolveBucket no match for preference:', cat.name, 'mapped->', mapped)
        return [] as EventItem[]
      }

      for (const cat of preferredList) {
        const bucket = resolveBucket(cat)
        const slice = bucket.slice(0, 4)
        for (const e of slice) selectedIds.add(e.id)
        sections.push({ title: String(cat.name), events: slice })
        // record canonical key for this preference (if possible) so later
        // we can skip adding duplicate sections from grouped buckets
        const canonical = mapCategory(String(cat.name)) || normalizeDisplayName(String(cat.name))
        sectionKeysAdded.add(String(canonical).toLowerCase())
      }
      // Do NOT render other categories separately; they will appear in remainingEvents
    } else {
      // No preferences selected: do not show category sections. All events will be shown in 'All Events'
    }

    // NOTE: we intentionally do NOT create additional category sections
    // beyond the user's selected preferences. Any events not included in
    // preference sections will appear in the final "All Events" list.

    // Exclude my events and already selected events from remaining list
    const myEventIds = new Set(myEvents.map((m) => m.id))
    const remaining = filtered.filter((e) => !selectedIds.has(e.id) && !myEventIds.has(e.id))

    // also append ungrouped events (unknown raw category mappings) to remaining
    for (const e of ungroupedEvents) {
      if (!selectedIds.has(e.id) && !myEventIds.has(e.id) && !remaining.find(r => r.id === e.id)) {
        remaining.push(e)
      }
    }

    return { categorySections: sections, remainingEvents: remaining }
  }, [filtered, categories, preferredCategoryIds, myEvents])

  // compute pagination based on remainingEvents (not including category sections)
  const totalPages = useMemo(() => Math.max(1, Math.ceil((categorySections?.length ? remainingEvents.length : filtered.length) / PAGE_SIZE)), [remainingEvents, filtered, categorySections])

  // determine which events to show in the All Events section for current page
  const eventsToShowInAll = useMemo(() => {
    // If there are category sections and we're on page 1, show the first PAGE_SIZE of remainingEvents
    if (categorySections.length > 0) {
      const start = (page - 1) * PAGE_SIZE
      return remainingEvents.slice(start, start + PAGE_SIZE)
    }
    // No categories: paginate over filtered (all events)
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [page, remainingEvents, filtered, categorySections])

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

          {user && page === 1 && (
            <section>
              <Heading level={2}>My Events</Heading>
              {!myEventsLoading && myEvents.length === 0 && (
                <Text as="p">You haven't created any events yet.</Text>
              )}
              <EventGrid events={myEvents} loading={myEventsLoading} onEventClick={handleEventClick} />
            </section>
          )}

          {/* Category-based sections (up to 4 items each) */}
          {loadingCategories ? (
            <Text as="p">Loading personalized sections...</Text>
          ) : null}
          {page === 1 && categorySections.map((sec) => (
            <section key={sec.title}>
              <Heading level={2}>{sec.title}</Heading>
              <EventGrid events={sec.events} onEventClick={handleEventClick} />
            </section>
          ))}

          {/* Final All Events section: remaining events not already shown */}
          <Heading level={2} style={{ marginTop: 'var(--space-xl)' }}>All Events</Heading>
          <EventGrid events={eventsToShowInAll} loading={loading} onEventClick={handleEventClick} />

          {/* Pagination controls for All Events */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
              <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
              <Text as="p">Page {page} of {totalPages}</Text>
              <Button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
          )}
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default EventsPage
