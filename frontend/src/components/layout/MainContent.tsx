import React from 'react'
import '../../styles/layout.css'
import { Container } from '../ui'

type MainContentProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  className?: string
}

const MainContent: React.FC<MainContentProps> = ({ children, className = '', ...rest }) => {
  return (
    <main className={`main-content ${className}`.trim()} {...rest}>
      <Container>{children}</Container>
    </main>
  )
}

export default MainContent
