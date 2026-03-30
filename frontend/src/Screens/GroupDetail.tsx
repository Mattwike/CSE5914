import React from 'react'
import { useParams } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Button, LazyImage } from '../components/ui'
import GroupHero from '../components/groups/GroupHero'
import '../styles/groups.css'

type GroupItem = {
  id: string
  name: string
  members: number
  location?: string
  description?: string
}

const makeMockGroup = (id?: string): GroupItem => ({
  id: id || '0',
  name: `Group #${id}`,
  members: 12,
  location: 'Campus',
  description: `Detailed information for group ${id}. This area will later be populated from the backend.`
})

const GroupDetail: React.FC = () => {
  const { id } = useParams()
  const group = makeMockGroup(id)

  const capacity = group.members + 10
  const spotsLeft = capacity - group.members

  return (
    <PageWrapper>
      <MainContent>
        <GroupHero />

        <div className="detail-card detail-card--centered">
          <Heading level={1} className="detail-title">{group.name}</Heading>

          <div className="detail-thumb-wrap">
            <LazyImage src="/block.jpg" alt={group.name} width={420} height={240} className="detail-thumb" />
          </div>

          <div className="detail-meta">
            <div className="detail-stats">{group.members} members · {spotsLeft} spots left</div>
            <div className="detail-location">{group.location}</div>
          </div>

          <div className="detail-description">
            <Text as="div">{group.description}</Text>
          </div>

          <div className="event-actions">
            <Button onClick={() => window.history.back()}>Back</Button>
          </div>
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default GroupDetail
