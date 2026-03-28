import React from 'react'
import { Input } from '../ui'

type Props = {
  search: string
  setSearch: (s: string) => void
  location: string
  setLocation: (l: string) => void
  locations: string[]
}

const EventFilters: React.FC<Props> = ({ search, setSearch, location, setLocation, locations }) => {
  return (
    <form className="grid filters-grid" role="search" aria-label="Event filters">
      <div>
        <label className="visually-hidden" htmlFor="event-search">Search events</label>
        <Input id="event-search" placeholder="Search events" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search events" />
      </div>
      <div>
        <label className="visually-hidden" htmlFor="event-location">Location</label>
        <select id="event-location" className="input" value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
          <option value="">All locations</option>
          {locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </form>
  )
}

export default EventFilters
