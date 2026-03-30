import React from 'react'
import GroupCard from './GroupCard'
import type { GroupItem } from './GroupCard'
import '../../styles/events.css'

type Props = {
  groups: GroupItem[]
  onGroupClick?: (id: string) => void
  loading?: boolean
}

import GroupSkeleton from './GroupSkeleton'

const GroupGrid: React.FC<Props> = ({ groups, onGroupClick, loading = false }) => {
  if (loading) {
    return (
      <section className="events-grid" aria-busy="true">
        {Array.from({ length: 6 }).map((_, i) => <GroupSkeleton key={i} />)}
      </section>
    )
  }

  if (!groups || groups.length === 0) return <div className="empty-state">No groups found.</div>

  return (
    <section className="events-grid">
      {groups.map((g) => <GroupCard key={g.id} group={g} onView={onGroupClick} />)}
    </section>
  )
}

export default GroupGrid
