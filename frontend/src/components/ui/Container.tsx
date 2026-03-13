import React from 'react'
import '../../styles/utilities.css'
import './ui.css'

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, className = '', ...rest }, ref) => {
  return (
    <div ref={ref} className={`site-container ${className}`.trim()} {...rest}>
      {children}
    </div>
  )
})

export default Container
