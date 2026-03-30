import React, { useEffect, useState } from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  lift?: boolean
}

const AnimatedCard = React.forwardRef<HTMLDivElement, Props>(({ children, className = '', lift = true, ...rest }, ref) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      ref={ref}
      className={["animated-card", lift ? 'card--lift' : '', visible ? 'is-visible' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
})

export default AnimatedCard
