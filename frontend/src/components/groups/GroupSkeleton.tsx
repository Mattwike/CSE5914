import React from 'react'
import '../../styles/events.css'

const GroupSkeleton: React.FC = () => {
  return (
    <div className="event-skeleton card">
      <div className="skeleton media" />
      <div className="skeleton title" />
      <div className="skeleton meta" />
    </div>
  )
}

export default GroupSkeleton
