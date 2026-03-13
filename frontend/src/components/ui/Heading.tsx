import React from 'react'
import './ui.css'

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(({ children, level = 2, className = '', ...rest }, ref) => {
  const Tag = (`h${level}`) as any
  const sizeClass =
    level === 1 ? 'type-hero' : level === 2 ? 'type-xl' : level === 3 ? 'type-lg' : level === 4 ? 'type-md' : 'type-body'
  return (
    <Tag ref={ref} className={`${sizeClass} ${className}`.trim()} {...(rest as any)}>
      {children}
    </Tag>
  )
})

export default Heading
