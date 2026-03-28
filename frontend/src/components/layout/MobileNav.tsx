import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import '../../styles/layout.css'

const MobileNav: React.FC = () => {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <NavLink to="/dashboard" onClick={(e) => { if (isLanding) e.preventDefault() }} className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '') + (isLanding ? ' disabled' : '')}>Home</NavLink>
      <NavLink to="/events" onClick={(e) => { if (isLanding) e.preventDefault() }} className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '') + (isLanding ? ' disabled' : '')}>Events</NavLink>
      <NavLink to="/groups" onClick={(e) => { if (isLanding) e.preventDefault() }} className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '') + (isLanding ? ' disabled' : '')}>Groups</NavLink>
      <NavLink to="/profile" onClick={(e) => { if (isLanding) e.preventDefault() }} className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '') + (isLanding ? ' disabled' : '')}>Profile</NavLink>
    </nav>
  )
}

export default MobileNav
