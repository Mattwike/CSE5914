import React from 'react'
import './ui.css'

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

const Heading: React.FC<HeadingProps> = ({ children, level = 2, className = '', ...rest }) => {
  // Build the tag name as a string and create the element with `React.createElement`.
  const tagName = `h${level}`
  // map typical sizes to the typography utility classes
  const sizeClass = level === 1 ? 'type-hero' : level === 2 ? 'type-xl' : 'type-body'
  return React.createElement(tagName, { className: `${sizeClass} ${className}`.trim(), ...rest }, children)
}

export default Heading
