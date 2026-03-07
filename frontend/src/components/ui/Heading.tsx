import React from 'react'
import './ui.css'

type HeadingProps = {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

const Heading: React.FC<HeadingProps> = ({ children, level = 2, className = '' }) => {
  const Tag = (`h${level}` as keyof JSX.IntrinsicElements) as any
  // map typical sizes to the typography utility classes
  const sizeClass = level === 1 ? 'type-hero' : level === 2 ? 'type-xl' : 'type-body'
  return (
    <Tag className={`${sizeClass} ${className}`.trim()}>
      {children}
    </Tag>
  )
}

export default Heading
