import React from 'react'
import '../../styles/layout.css'
import { Heading, Button } from '../ui'

type HeaderProps = {
  title?: string
  onLogout?: () => void
}

const Header: React.FC<HeaderProps> = ({ title = 'App Name', onLogout }) => {
  return (
    <header className="site-header">
      <Heading level={2}>{title}</Heading>
      {onLogout ? <Button variant="ghost" onClick={onLogout}>Logout</Button> : null}
    </header>
  )
}

export default Header
