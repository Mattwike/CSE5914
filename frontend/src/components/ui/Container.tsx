import React from 'react'
import '../../styles/utilities.css'

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  className?: string
}

const Container: React.FC<ContainerProps> = ({ children, className = '', ...rest }) => {
  return <div className={`container ${className}`.trim()} {...rest}>{children}</div>
}

export default Container
