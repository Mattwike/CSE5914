import React, { useEffect, useState } from 'react'
import { PageWrapper, MainContent } from '../components/layout'
import { Button, Card, Heading, Text } from '../components/ui'
import { getCategories } from '../services/events'

const Settings: React.FC = () => {
  const [preferenceMessage, setPreferenceMessage] = useState('')
  const [interests, setInterests] = useState<string[]>(['Social', 'Career'])
  const [interestOptions, setInterestOptions] = useState<string[]>([])
  const [eventSize, setEventSize] = useState('Medium')
  const [preferredTime, setPreferredTime] = useState('Evening')
  const [eventVibe, setEventVibe] = useState('Meet people')
  const [formatPreference, setFormatPreference] = useState('Either')
  const [travelDistance, setTravelDistance] = useState('Anywhere on campus')
  const [recommendationFrequency, setRecommendationFrequency] = useState('Weekly')
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      try {
        const data = await getCategories()
        if (!isMounted) return
        setInterestOptions(data.categories)
        setInterests((current) => current.filter((item) => data.categories.includes(item)))
        setCategoryError('')
      } catch (err: any) {
        if (!isMounted) return
        setCategoryError(err?.message || 'Unable to load categories.')
      } finally {
        if (isMounted) setLoadingCategories(false)
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

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
        <Heading level={1}>Settings</Heading>
        <Text as="p" className="mb-1">Manage your private app and recommendation preferences.</Text>

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
                  {loadingCategories ? <Text as="p">Loading categories...</Text> : null}
                  {categoryError ? <Text as="p" className="error-text">{categoryError}</Text> : null}
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

export default Settings
