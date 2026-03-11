import React from 'react'
import './ui.css'

type TextProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  as?: 'p' | 'span' | 'div'
  className?: string
}

const Text = React.forwardRef<HTMLElement, TextProps>(({ children, as = 'p', className = '', ...rest }, ref) => {
  const Tag = as as any
  return (
    <Tag ref={ref as any} className={`type-body ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
})

export default Text
