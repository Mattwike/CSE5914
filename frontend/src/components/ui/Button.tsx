import React from 'react'
import './ui.css'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ children, variant = 'primary', className = '', ...rest }, ref) => {
  const cls = ['btn', variant === 'primary' ? 'btn--primary' : variant === 'danger' ? 'btn--danger' : 'btn--ghost']
  if (className) cls.push(className)
  return (
    <button ref={ref} className={cls.join(' ')} {...rest}>
      {children}
    </button>
  )
})

export default Button
