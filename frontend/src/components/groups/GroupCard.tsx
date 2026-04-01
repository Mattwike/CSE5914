import React from 'react'
import { AnimatedCard, Heading, Text, Button } from '../ui'
import LazyImage from '../ui/LazyImage'
import '../../styles/groups.css'

export type GroupItem = {
  id: string
  name: string
  members: number
  location?: string
  description?: string
  thumbnail?: string
  join_policy?: 'open' | 'approval'
}

type Props = {
  group: GroupItem
  onView?: (id: string) => void
}

const GroupCard: React.FC<Props> = ({ group, onView }) => {
  const { id, name, members, location, description, thumbnail, join_policy } = group
  const thumb = thumbnail || '/block.jpg'
  const thumbSrcSet = `${thumb} 640w, ${thumb} 320w`
  const thumbSizes = '(max-width: 420px) 100vw, 320px'

  return (
    <AnimatedCard className={`event-card group-card`} aria-labelledby={`group-title-${id}`}>
      <div className="event-card-media">
        <LazyImage src={thumb} alt={`${name} thumbnail`} width={320} height={180} className="event-card-thumb" srcSet={thumbSrcSet} sizes={thumbSizes} />
      </div>

      <div className="event-card-body">
        <div className="event-card-header">
          <Heading level={3} id={`group-title-${id}`}>{name}</Heading>
          <Text as="p" className="event-meta">{members} members{join_policy ? ` · ${join_policy === 'open' ? 'Open' : 'Approval required'}` : ''}</Text>
        </div>

        {description ? <Text as="div" className="event-desc">{description}</Text> : null}

        <div className="event-actions">
          <Button onClick={() => onView?.(id)}>View Group</Button>
        </div>
      </div>
    </AnimatedCard>
  )
}

export default GroupCard
