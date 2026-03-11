import React from 'react'
import '../../styles/layout.css'
import { Heading, Text } from '../ui'

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
            <li><Text as="span">Home</Text></li>
            <li><Text as="span">Profile</Text></li>
            <li><Text as="span">Settings</Text></li>
          </ul>
        </nav>
      )}
    </aside>
  )
}

export default Sidebar
