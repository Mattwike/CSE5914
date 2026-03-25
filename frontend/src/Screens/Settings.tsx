import React from 'react'
import { PageWrapper, Sidebar, MainContent } from '../components/layout'
import { Heading, Text } from '../components/ui'

const Settings: React.FC = () => {
  return (
    <PageWrapper>
      <div className="app-layout">
        <Sidebar />
        <MainContent>
          <Heading level={1}>Settings</Heading>
          <Text as="p">This is a stub Settings page. Add account and application settings here.</Text>
        </MainContent>
      </div>
    </PageWrapper>
  )
}

export default Settings
