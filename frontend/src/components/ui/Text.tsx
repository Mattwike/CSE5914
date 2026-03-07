import React from 'react'
import './ui.css'

type TextProps = {
  children: React.ReactNode
  as?: 'p' | 'span' | 'div'
  className?: string
}

const Text: React.FC<TextProps> = ({ children, as = 'p', className = '' }) => {
  const Tag = as as any
  return <Tag className={`type-body ${className}`.trim()}>{children}</Tag>
}

export default Text
