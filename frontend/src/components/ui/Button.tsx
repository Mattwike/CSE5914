import React from 'react'
import './ui.css'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', onClick, className = '', disabled = false, type = 'button' }) => {
  const cls = `btn ${variant === 'primary' ? 'btn--primary' : 'btn--ghost'} ${className}`.trim()
  return (
    <button className={cls} onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  )
}

export default Button
