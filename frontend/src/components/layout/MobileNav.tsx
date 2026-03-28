import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/layout.css'

const MobileNav: React.FC = () => {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <NavLink to="/dashboard" className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '')}>Home</NavLink>
      <NavLink to="/events" className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '')}>Events</NavLink>
      <NavLink to="/groups" className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '')}>Groups</NavLink>
      <NavLink to="/profile" className={({isActive}) => "mobile-nav-link" + (isActive ? ' active' : '')}>Profile</NavLink>
    </nav>
  )
}

export default MobileNav
