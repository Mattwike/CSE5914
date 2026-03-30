import React from 'react'
import '../../styles/layout.css'
import { Heading, Button, Container } from '../ui'

type HeaderProps = {
  title?: string
  onLogout?: () => void
  className?: string
}

const Header: React.FC<HeaderProps> = ({ title = 'App Name', onLogout, className = '' }) => {
  return (
    <Container>
      <header className={`site-header ${className}`.trim()}>
        <Heading level={2}>{title}</Heading>
        {onLogout ? <Button variant="danger" onClick={onLogout}>Logout</Button> : null}
      </header>
    </Container>
  )
}

export default Header
