import React from 'react'
import './ui.css'

type TextProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  as?: 'p' | 'span' | 'div'
  className?: string
}

const Text: React.FC<TextProps> = ({ children, as = 'p', className = '', ...rest }) => {
  const Tag = as as any
  return <Tag className={`type-body ${className}`.trim()} {...rest}>{children}</Tag>
}

export default Text
