import React from 'react'
import { Card, Heading, Text } from '../ui'
import LazyImage from '../ui/LazyImage'
import '../../styles/events.css'

type Props = {
  title?: string
  subtitle?: string
  image?: string
}

const GroupHero: React.FC<Props> = ({ title = 'Find student groups', subtitle = 'Join people with similar interests', image = '/union.jpg' }) => {
  const srcSet = `${image} 1200w, ${image} 800w, ${image} 480w`
  const sizes = '(min-width: 1024px) 1200px, (min-width: 768px) 800px, 100vw'

  return (
    <Card className="event-hero card--elevated" style={{ ['--event-hero-image' as any]: `url('${image}')` }}>
      <div className="event-hero-inner">
        <div className="event-hero-media">
          <LazyImage src={image} alt="Union" className="event-hero-image" width={1200} height={320} srcSet={srcSet} sizes={sizes} />
        </div>
        <div className="event-hero-content">
          <Heading level={2}>{title}</Heading>
          <Text as="p">{subtitle}</Text>
        </div>
      </div>
    </Card>
  )
}

export default GroupHero
