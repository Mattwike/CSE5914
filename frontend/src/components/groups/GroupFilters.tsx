import React from 'react'
import { Input } from '../ui'

type Props = {
  search: string
  setSearch: (s: string) => void
  location: string
  setLocation: (l: string) => void
  locations: string[]
}

const GroupFilters: React.FC<Props> = ({ search, setSearch, location, setLocation, locations }) => {
  return (
    <form className="grid filters-grid" role="search" aria-label="Group filters">
      <div>
        <label className="visually-hidden" htmlFor="group-search">Search groups</label>
        <Input id="group-search" placeholder="Search groups" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search groups" />
      </div>
      <div>
        <label className="visually-hidden" htmlFor="group-location">Join policy</label>
        <select id="group-location" className="input" value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter groups by join policy">
          <option value="">All groups</option>
          {locations.map((l) => <option key={l} value={l}>{l === 'open' ? 'Open' : 'Approval required'}</option>)}
        </select>
      </div>
    </form>
  )
}

export default GroupFilters
