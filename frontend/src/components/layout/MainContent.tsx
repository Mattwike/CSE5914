import React from 'react'
import '../../styles/layout.css'

type MainContentProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
}

const MainContent: React.FC<MainContentProps> = ({ children, ...rest }) => {
  return (
    <main className="main-content" {...rest}>
      {children}
    </main>
  )
}

export default MainContent
