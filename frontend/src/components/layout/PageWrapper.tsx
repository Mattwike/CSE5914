import React from 'react'
import '../../styles/layout.css'
import { Container } from '../ui'

type PageWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className = '', ...rest }) => {
  return (
    <div className={`page-wrapper ${className}`.trim()} {...rest}>
      <Container>{children}</Container>
    </div>
  )
}

export default PageWrapper
