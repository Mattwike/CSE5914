import React from 'react'
import '../../styles/layout.css'

type SidebarProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <aside className="app-sidebar">
      {children ? (
        children
      ) : (
        <nav>
          <ul className="sidebar-nav">
            <li>Home</li>
            <li>Profile</li>
            <li>Settings</li>
          </ul>
        </nav>
      )}
    </aside>
  )
}

export default Sidebar
