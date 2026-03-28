import React from 'react'
import { Card, Heading, Text } from '../ui'
import LazyImage from '../ui/LazyImage'
import '../../styles/events.css'

type Props = {
  title?: string
  subtitle?: string
  image?: string
}

const EventHero: React.FC<Props> = ({ title = 'Discover campus events', subtitle = 'Find student groups and activities near you', image = '/campus_crowd.jpg' }) => {
  const srcSet = `${image} 1200w, ${image} 800w, ${image} 480w`
  const sizes = '(min-width: 1024px) 1200px, (min-width: 768px) 800px, 100vw'

  return (
    <Card className="event-hero card--elevated">
      <div className="event-hero-inner">
        <div className="event-hero-media">
          <LazyImage src={image} alt="Campus crowd" className="event-hero-image" width={1200} height={320} srcSet={srcSet} sizes={sizes} />
        </div>
        <div className="event-hero-content">
          <Heading level={2}>{title}</Heading>
          <Text as="p">{subtitle}</Text>
        </div>
      </div>
    </Card>
  )
}

export default EventHero
