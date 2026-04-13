import React from 'react'
import { NavLink } from 'react-router-dom'
import '../../styles/layout.css'
import { Heading } from '../ui'

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
  className?: string
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  return (
    <aside className={`app-sidebar ${className}`.trim()}>
      {children ? (
        children
      ) : (
        <nav>
          <Heading level={3} className="mb-2">Navigation</Heading>
          <ul className="sidebar-nav">
            <li><NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
            <li><NavLink to="/events" className={({isActive}) => isActive ? 'active' : ''}>Events</NavLink></li>
            <li><NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink></li>
          </ul>
        </nav>
      )}
    </aside>
  )
}

export default Sidebar
