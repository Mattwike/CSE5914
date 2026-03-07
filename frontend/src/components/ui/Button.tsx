import React from 'react'
import './ui.css'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...rest }) => {
  const cls = `btn ${variant === 'primary' ? 'btn--primary' : 'btn--ghost'} ${className}`.trim()
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

export default Button
