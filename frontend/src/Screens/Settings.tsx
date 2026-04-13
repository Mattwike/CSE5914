import React, { useEffect, useState } from 'react'
import { PageWrapper, MainContent } from '../components/layout'
import { Button, Card, Heading, Text } from '../components/ui'
import { getCategories, type CategoryItem } from '../services/events'
import {
  getCategoryPreferences,
  getUserPreferences,
  saveCategoryPreferences,
  saveUserPreferences,
} from '../services/preferences'
import '../styles/profile.css'

const Settings: React.FC = () => {
  const travelDistanceOptions = ['On campus', 'Short commute', 'Anywhere']
  const eventSizeLabels = ['Small (1-30)', 'Medium (31-150)', 'Large (151-500)', 'Mega (500+)']
  const eventSizeValues = ['small', 'medium', 'large', 'mega'] as const
  const eventTimeOptions = [
    {
      group: 'Weekdays',
      options: [
        { label: 'Mornings', value: 'Weekday mornings', id: 0 },
        { label: 'Afternoons', value: 'Weekday afternoons', id: 1 },
        { label: 'Evenings', value: 'Weekday evenings', id: 2 },
      ],
    },
    {
      group: 'Weekends',
      options: [
        { label: 'Mornings', value: 'Weekend mornings', id: 3 },
        { label: 'Afternoons', value: 'Weekend afternoons', id: 4 },
        { label: 'Evenings', value: 'Weekend evenings', id: 5 },
      ],
    },
  ]
  const [preferenceMessage, setPreferenceMessage] = useState('')
  const [interests, setInterests] = useState<Array<string | number>>([])
  const [interestOptions, setInterestOptions] = useState<CategoryItem[]>([])
  const [travelDistance, setTravelDistance] = useState('Anywhere')
  const [eventSize, setEventSize] = useState(4)
  const [eventTimes, setEventTimes] = useState<number[]>([])
  const [openMenu, setOpenMenu] = useState<'travelDistance' | null>(null)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [savingCategories, setSavingCategories] = useState(false)
  const [categoryError, setCategoryError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      const userId = localStorage.getItem('userId')

      if (!userId) {
        if (isMounted) {
          setCategoryError('No logged-in user found. Please log in again.')
          setLoadingCategories(false)
        }
        return
      }

      try {
        const [categoriesData, categoryPreferencesData, userPreferencesData] = await Promise.all([
          getCategories(),
          getCategoryPreferences(userId),
          getUserPreferences(userId),
        ])
        if (!isMounted) return
        setInterestOptions(categoriesData.categories)
        setInterests(categoryPreferencesData.category_ids)
        setEventSize(eventSizeValues.indexOf(userPreferencesData.event_size) + 1 || 4)
        setTravelDistance(travelDistanceOptions[userPreferencesData.event_distance] ?? 'Anywhere')
        setEventTimes(userPreferencesData.event_times ?? [])
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

  useEffect(() => {
    function closeMenu() {
      setOpenMenu(null)
    }

    window.addEventListener('click', closeMenu)
    return () => window.removeEventListener('click', closeMenu)
  }, [])

  const toggleInterest = (categoryId: string | number) => {
    setInterests((current) =>
      current.includes(categoryId)
        ? current.filter((item) => item !== categoryId)
        : [...current, categoryId]
    )
  }

  const toggleEventTime = (option: number) => {
    setEventTimes((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    )
  }

  const savePreferences = async () => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setCategoryError('No logged-in user found. Please log in again.')
      return
    }

    setSavingCategories(true)
    setPreferenceMessage('')
    setCategoryError('')

    try {
      const [categoryResponse, preferenceResponse] = await Promise.all([
        saveCategoryPreferences({
          user_id: userId,
          category_ids: interests,
        }),
        saveUserPreferences({
          user_id: userId,
          event_size: eventSizeValues[eventSize - 1],
          event_distance: travelDistanceOptions.indexOf(travelDistance) as 0 | 1 | 2,
          event_times: eventTimes,
        }),
      ])
      setPreferenceMessage(preferenceResponse?.message || categoryResponse?.message || 'Preferences saved.')
    } catch (err: any) {
      setCategoryError(err?.message || 'Unable to save preferences.')
    } finally {
      setSavingCategories(false)
    }
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
                <Text as="p" className="mb-1">What kinds of events interest you most?</Text>
                {loadingCategories ? <Text as="p">Loading categories...</Text> : null}
                {categoryError ? <Text as="p" className="error-text">{categoryError}</Text> : null}
                <div className="profile-choice-grid">
                  {interestOptions.map((interest) => {
                    const selected = interests.includes(interest.id)

                    return (
                      <button
                        key={String(interest.id)}
                        type="button"
                        className={selected ? 'profile-choice profile-choice--active' : 'profile-choice'}
                        aria-pressed={selected}
                        onClick={() => toggleInterest(interest.id)}
                      >
                        {interest.name}
                      </button>
                    )
                  })}
                </div>
                <Text as="p" className="profile-helper">Choose as many as apply.</Text>
              </div>

              <div>
                <Text as="p" className="mb-1">When do you usually want events?</Text>
                <div className="profile-choice-groups">
                  {eventTimeOptions.map((section) => (
                    <div key={section.group} className="profile-choice-group">
                      <Text as="p" className="profile-choice-group-title">{section.group}</Text>
                      <div className="profile-choice-stack">
                        {section.options.map((option) => {
                          const selected = eventTimes.includes(option.id)

                          return (
                            <button
                              key={option.id}
                              type="button"
                              className={selected ? 'profile-choice profile-choice--active' : 'profile-choice'}
                              aria-pressed={selected}
                              onClick={() => toggleEventTime(option.id)}
                            >
                              {option.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <Text as="p" className="profile-helper">Choose as many as apply.</Text>
              </div>

              <div>
                <label className="input-label" htmlFor="event-size">What size events do you prefer?</label>
                <div className="profile-range-control">
                  <input
                    id="event-size"
                    className="profile-range"
                    style={{ '--range-progress': `${((eventSize - 1) / (eventSizeLabels.length - 1)) * 100}%` } as React.CSSProperties}
                    type="range"
                    min="1"
                    max={eventSizeLabels.length}
                    step="1"
                    value={eventSize}
                    onChange={(e) => setEventSize(Number(e.target.value))}
                  />
                  <div className="profile-range-labels" aria-hidden="true">
                    {eventSizeLabels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
                <Text as="p" className="profile-helper">Selected: {eventSizeLabels[eventSize - 1]}</Text>
              </div>

              <div>
                <label className="input-label" htmlFor="travel-distance-trigger">How far are you willing to travel?</label>
                <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                  <button
                    id="travel-distance-trigger"
                    type="button"
                    className="profile-dropdown-trigger"
                    aria-haspopup="listbox"
                    aria-expanded={openMenu === 'travelDistance'}
                    onClick={() => setOpenMenu((current) => current === 'travelDistance' ? null : 'travelDistance')}
                  >
                    {travelDistance}
                  </button>
                  {openMenu === 'travelDistance' ? (
                    <div className="profile-dropdown-menu" role="listbox" aria-labelledby="travel-distance-trigger">
                      {travelDistanceOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={travelDistance === option ? 'profile-dropdown-option profile-dropdown-option--active' : 'profile-dropdown-option'}
                          onClick={() => {
                            setTravelDistance(option)
                            setOpenMenu(null)
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="section-actions">
                <Button className="btn--small" onClick={savePreferences} disabled={savingCategories || loadingCategories}>
                  {savingCategories ? 'Saving...' : 'Save Preferences'}
                </Button>
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
