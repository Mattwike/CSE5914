import React from 'react'
import '../../styles/utilities.css'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return <div className={`container ${className}`.trim()}>{children}</div>
}

export default Container
