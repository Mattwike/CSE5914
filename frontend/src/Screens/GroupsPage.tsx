import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { GroupGrid, GroupFilters, GroupHero } from '../components/groups'
import { Heading } from '../components/ui'
import '../styles/events.css'

type GroupItem = {
  id: string
  name: string
  members: number
  location?: string
  description?: string
}

const MOCK_GROUPS: GroupItem[] = Array.from({ length: 18 }).map((_, i) => ({
  id: String(i + 1),
  name: `Group #${i + 1}`,
  members: Math.floor(Math.random() * 40) + 3,
  location: i % 3 === 0 ? 'Campus' : i % 3 === 1 ? 'Off-campus' : 'Online',
  description: `A friendly group for activity ${i + 1}.`
}))

const PAGE_SIZE = 10

const GroupsPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return MOCK_GROUPS.filter((g) => {
      if (s && !g.name.toLowerCase().includes(s)) return false
      if (location && g.location !== location) return false
      return true
    })
  }, [search, location])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const locations = useMemo(() => Array.from(new Set(MOCK_GROUPS.map((g) => g.location).filter(Boolean) as string[])), [])

  const navigate = useNavigate()

  const handleGroupClick = (id: string) => navigate(`/groups/${id}`)

  return (
    <PageWrapper>
      <MainContent>
        <div className="stack-vertical">
          <GroupHero image="/union.jpg" />
          <Heading level={1}>Looking for groups</Heading>

          <GroupFilters search={search} setSearch={(s) => { setSearch(s); setPage(1) }} location={location} setLocation={(l) => { setLocation(l); setPage(1) }} locations={locations} />

          <GroupGrid groups={paginated} onGroupClick={handleGroupClick} />

          <div className="flex-center pagination">
            <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
            <div>Page {page} of {totalPages}</div>
            <button className="btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default GroupsPage
