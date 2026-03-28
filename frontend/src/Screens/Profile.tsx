import React, { useState } from 'react'
import { PageWrapper, MainContent } from '../components/layout'
import { Button, Card, Heading, Input, Text } from '../components/ui'

const Profile: React.FC = () => {
  const [firstName, setFirstName] = useState('Brutus')
  const [lastName, setLastName] = useState('Buckeye')
  const [gender, setGender] = useState('Prefer not to say')
  const [savedMessage, setSavedMessage] = useState('')
  const [preferenceMessage, setPreferenceMessage] = useState('')
  const [interests, setInterests] = useState<string[]>(['Social', 'Career'])
  const [eventSize, setEventSize] = useState('Medium')
  const [preferredTime, setPreferredTime] = useState('Evening')
  const [eventVibe, setEventVibe] = useState('Meet people')
  const [formatPreference, setFormatPreference] = useState('Either')
  const [travelDistance, setTravelDistance] = useState('Anywhere on campus')
  const [recommendationFrequency, setRecommendationFrequency] = useState('Weekly')

  const interestOptions = ['Social', 'Academic', 'Career', 'Fitness', 'Arts', 'Volunteering']

  const handleSave = () => {
    setSavedMessage('Profile changes saved.')
  }

  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    )
  }

  const savePreferences = () => {
    setPreferenceMessage('Event preferences saved.')
  }

  return (
    <PageWrapper>
      <MainContent>
        <Heading level={1}>Profile</Heading>
        <Text as="p" className="mb-1">Update your profile details below.</Text>

        <section className="profile-section">
          <Heading level={2} className="section-title">Bio</Heading>
          <Card className="card card--elevated section-card mt-2">
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

              <div className="section-actions">
                <Button className="btn--small" onClick={handleSave}>Save</Button>
              </div>
              {savedMessage ? <Text as="p" className="status-active">{savedMessage}</Text> : null}
            </div>
          </Card>
        </section>

        <section className="profile-section">
          <Heading level={2} className="section-title">Event Preferences</Heading>
          <Card className="card card--elevated section-card mt-2">
            <div className="form-stack">
              <div>
                <Text as="p">Tell us what kinds of events match your personality and routine.</Text>
              </div>

              <div>
                <Text as="p" className="mb-1">What kinds of events interest you most?</Text>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {interestOptions.map((interest) => (
                    <label key={interest} className="card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
                      <input
                        type="checkbox"
                        checked={interests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label" htmlFor="event-size">What size events do you prefer?</label>
                <select
                  id="event-size"
                  className="input"
                  value={eventSize}
                  onChange={(e) => setEventSize(e.target.value)}
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="preferred-time">When do you usually want events?</label>
                <select
                  id="preferred-time"
                  className="input"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="event-vibe">What vibe are you looking for?</label>
                <select
                  id="event-vibe"
                  className="input"
                  value={eventVibe}
                  onChange={(e) => setEventVibe(e.target.value)}
                >
                  <option value="Meet people">Meet people</option>
                  <option value="Learn something">Learn something</option>
                  <option value="Relax">Relax</option>
                  <option value="Career growth">Career growth</option>
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="format-preference">Do you prefer in-person or virtual events?</label>
                <select
                  id="format-preference"
                  className="input"
                  value={formatPreference}
                  onChange={(e) => setFormatPreference(e.target.value)}
                >
                  <option value="In-person">In-person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Either">Either</option>
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="travel-distance">How far are you willing to travel?</label>
                <select
                  id="travel-distance"
                  className="input"
                  value={travelDistance}
                  onChange={(e) => setTravelDistance(e.target.value)}
                >
                  <option value="Walkable">Walkable</option>
                  <option value="Short commute">Short commute</option>
                  <option value="Anywhere on campus">Anywhere on campus</option>
                </select>
              </div>

              <div>
                <label className="input-label" htmlFor="recommendation-frequency">How often do you want recommendations?</label>
                <select
                  id="recommendation-frequency"
                  className="input"
                  value={recommendationFrequency}
                  onChange={(e) => setRecommendationFrequency(e.target.value)}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Only when I check">Only when I check</option>
                </select>
              </div>

              <div className="section-actions">
                <Button className="btn--small" onClick={savePreferences}>Save Preferences</Button>
              </div>
              {preferenceMessage ? <Text as="p" className="status-active">{preferenceMessage}</Text> : null}
            </div>
          </Card>
        </section>
      </MainContent>
    </PageWrapper>
  )
}

export default Profile
