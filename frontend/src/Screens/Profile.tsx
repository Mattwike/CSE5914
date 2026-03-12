import React, { useState } from 'react'
import { PageWrapper, Sidebar, MainContent } from '../components/layout'
import { Button, Card, Heading, Input, Text } from '../components/ui'

const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState('Alex')
  const [lastName, setLastName] = useState('Johnson')
  const [gender, setGender] = useState('Prefer not to say')
  const [savedMessage, setSavedMessage] = useState('')

  const handleSave = () => {
    setSavedMessage('Profile changes saved.')
  }

  return (
    <PageWrapper>
      <div className="app-layout">
        <Sidebar />
        <MainContent>
          <Heading level={1}>Profile</Heading>
          <Text as="p" className="mb-1">Update your profile details below.</Text>

          <Card className="card card--elevated mt-2">
            <div className="form-stack">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />

              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />

              <div>
                <label className="input-label" htmlFor="profile-gender">Gender</label>
                <select
                  id="profile-gender"
                  className="input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <Button onClick={handleSave}>Save</Button>
              {savedMessage ? <Text as="p" className="status-active">{savedMessage}</Text> : null}
            </div>
          </Card>
        </MainContent>
      </div>
    </PageWrapper>
  )
}

export default Profile
