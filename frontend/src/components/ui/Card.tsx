import React from 'react'
import './ui.css'

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
  elevated?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, className = '', elevated = false, ...rest }, ref) => {
  const classes = ['card']
  if (elevated) classes.push('card--elevated')
  if (className) classes.push(className)
  return (
    <div ref={ref} className={classes.join(' ')} {...rest}>
      {children}
    </div>
  )
})

export default Card
