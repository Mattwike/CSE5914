import React from 'react'
import './ui.css'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className = '', ...rest }) => {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
}

export default Card
