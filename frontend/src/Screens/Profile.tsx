import React from 'react'
import { PageWrapper, Sidebar, MainContent } from '../components/layout'
import { Heading, Text } from '../components/ui'

const Profile: React.FC = () => {
  return (
    <PageWrapper>
      <div className="app-layout">
        <Sidebar />
        <MainContent>
          <Heading level={1}>Profile</Heading>
          <Text as="p">This is a stub Profile page. Replace with profile details.</Text>
        </MainContent>
      </div>
    </PageWrapper>
  )
}

export default Profile
