import React, { useEffect, useState } from 'react'
import { PageWrapper, MainContent } from '../components/layout'
import { Button, Card, Heading, Input, Text } from '../components/ui'
import '../styles/profile.css'
import { getProfile, updateProfile } from '../services/auth'
import { useAuthContext } from '../context/AuthContext'
import { getCategories, type CategoryItem } from '../services/events'
import {
  getCategoryPreferences,
  getUserPreferences,
  saveCategoryPreferences,
  saveUserPreferences,
} from '../services/preferences'

const Profile: React.FC = () => {
  const bioCharacterLimit = 280
  const graduationYearOptions = Array.from({ length: 8 }, (_, index) => String(new Date().getFullYear() + index))
  const hasCarOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]
  
  // Settings/Preferences constants
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

  // Profile states
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [major, setMajor] = useState('')
  const [hasCar, setHasCar] = useState(true)
  const [bio, setBio] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showValidation, setShowValidation] = useState(false)
  const [openMenu, setOpenMenu] = useState<'graduationYear' | 'hasCar' | 'travelDistance' | null>(null)
  
  // Preferences states
  const [preferenceMessage, setPreferenceMessage] = useState('')
  const [interests, setInterests] = useState<Array<string | number>>([])
  const [interestOptions, setInterestOptions] = useState<CategoryItem[]>([])
  const [travelDistance, setTravelDistance] = useState('Anywhere')
  const [eventSize, setEventSize] = useState(4)
  const [eventTimes, setEventTimes] = useState<number[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState('')

  const { user } = useAuthContext()
  const requiredFilled = displayName.trim() !== '' && major.trim() !== '' && graduationYear !== ''
  const basicFilled = displayName.trim() !== ''
  const academicFilled = basicFilled && major.trim() !== '' && graduationYear !== ''

  // Load profile and preferences
  useEffect(() => {
    if (!user?.user_id) {
      userId && setUserId('')
      setError('No logged-in user found. Please log in again.')
      setLoading(false)
      return
    }

    let isMounted = true

    async function loadData() {
      try {
        const [profile, categoriesData, categoryPreferencesData, userPreferencesData] = await Promise.all([
          getProfile(user!.user_id),
          getCategories(),
          getCategoryPreferences(user!.user_id),
          getUserPreferences(user!.user_id),
        ])
        
        if (!isMounted) return

        // Load profile data
        setUserId(profile.id)
        setEmail(profile.email ?? '')
        setIsVerified(Boolean(profile.verified))
        setDisplayName(profile.display_name ?? '')
        setBirthDate(profile.birth_date ?? '')
        setGraduationYear(profile.graduation_year != null ? String(profile.graduation_year) : '')
        setMajor(profile.major ?? '')
        setHasCar(Boolean(profile.has_car))
        setBio(profile.bio ?? '')

        // Load preference data
        setInterestOptions(categoriesData.categories)
        setInterests(categoryPreferencesData.category_ids)
        setEventSize(eventSizeValues.indexOf(userPreferencesData.event_size) + 1 || 4)
        setTravelDistance(travelDistanceOptions[userPreferencesData.event_distance] ?? 'Anywhere')
        setEventTimes(userPreferencesData.event_times ?? [])
        
        setError('')
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message || 'Unable to load profile.')
      } finally {
        if (isMounted) setLoading(false)
        if (isMounted) setLoadingCategories(false)
      }
    }

    loadData()
    return () => { isMounted = false }
  }, [user])

  useEffect(() => {
    function closeMenu() { setOpenMenu(null) }
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

  const handleSave = async () => {
    if (!user?.user_id) {
      setError('No logged-in user found. Please log in again.')
      return
    }
    if (!requiredFilled) {
      setShowValidation(true)
      setError('Please fill in all required fields before saving.')
      return
    }

    setSaving(true)
    setSavedMessage('')
    setError('')
    setCategoryError('')
    setPreferenceMessage('')
    setShowValidation(false)

    try {
      // Save profile and preferences in parallel
      const [updatedProfile] = await Promise.all([
        updateProfile({
          id: user!.user_id,
          display_name: displayName,
          birth_date: birthDate || null,
          graduation_year: graduationYear ? Number(graduationYear) : null,
          major,
          has_car: hasCar,
          bio,
        }),
        saveCategoryPreferences({
          user_id: user!.user_id,
          category_ids: interests,
        }),
        saveUserPreferences({
          user_id: user!.user_id,
          event_size: eventSizeValues[eventSize - 1],
          event_distance: travelDistanceOptions.indexOf(travelDistance) as 0 | 1 | 2,
          event_times: eventTimes,
        }),
      ])

      setUserId(updatedProfile.id)
      setEmail(updatedProfile.email ?? '')
      setIsVerified(Boolean(updatedProfile.verified))
      setDisplayName(updatedProfile.display_name ?? '')
      setBirthDate(updatedProfile.birth_date ?? '')
      setGraduationYear(updatedProfile.graduation_year != null ? String(updatedProfile.graduation_year) : '')
      setMajor(updatedProfile.major ?? '')
      setHasCar(Boolean(updatedProfile.has_car))
      setBio(updatedProfile.bio ?? '')
      
      setSavedMessage('Profile and preferences saved successfully!')
    } catch (err: any) {
      setError(err?.message || 'Unable to save profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageWrapper>
      <MainContent>
        <Heading level={1}>Profile</Heading>
        <Text as="p" className="mb-1">Update your profile details and event preferences below. All fields are required.</Text>

        {loading || loadingCategories ? <Text as="p">Loading profile...</Text> : null}
        {error ? <Text as="p" className="error-text">{error}</Text> : null}
        {categoryError ? <Text as="p" className="error-text">{categoryError}</Text> : null}

        <section className="profile-section" aria-busy={loading || loadingCategories}>
          <Heading level={2} className="section-title">Profile Details</Heading>
          <Card className="card card--elevated section-card mt-2 profile-card">

            {/* Account */}
            <div className="profile-block">
              <Text as="p" className="profile-block-title">Account</Text>
              <div className="profile-grid">
                <div className="profile-static-field">
                  <label className="input-label">Email</label>
                  <p className="profile-static-value">{email}</p>
                </div>
                <div className="profile-static-field">
                  <label className="input-label">Status</label>
                  <p>
                    <span className={isVerified ? 'profile-badge profile-badge--ok' : 'profile-badge'}>
                      {isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            {/* Basic */}
            <div className="profile-block">
              <Text as="p" className="profile-block-title">
                Basic
                {displayName.trim() === '' && (
                  <span style={{ color: 'var(--error, red)', fontSize: '0.8rem' }}> * required</span>
                )}
              </Text>
              {showValidation && !displayName.trim() && (
                <Text as="p" style={{ color: 'var(--error, red)', fontSize: '0.85rem', marginBottom: 8 }}>
                  Display Name is required.
                </Text>
              )}
              <div className="profile-grid">
                <Input
                  label="Display Name *"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
                <div>
                  <label className="input-label" htmlFor="birth-date">Birth Date</label>
                  <input
                    id="birth-date"
                    type="date"
                    className="input"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label" htmlFor="has-car-trigger">Has Car</label>
                  <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button
                      id="has-car-trigger"
                      type="button"
                      className="profile-dropdown-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={openMenu === 'hasCar'}
                      onClick={() => setOpenMenu((current) => current === 'hasCar' ? null : 'hasCar')}
                    >
                      {hasCar ? 'Yes' : 'No'}
                    </button>
                    {openMenu === 'hasCar' ? (
                      <div className="profile-dropdown-menu" role="listbox" aria-labelledby="has-car-trigger">
                        {hasCarOptions.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            className={hasCar === option.value ? 'profile-dropdown-option profile-dropdown-option--active' : 'profile-dropdown-option'}
                            onClick={() => { setHasCar(option.value); setOpenMenu(null) }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            {/* Academic - greyed out until displayName filled */}
            <div
              className="profile-block"
              style={{
                opacity: basicFilled ? 1 : 0.4,
                pointerEvents: basicFilled ? 'auto' : 'none'
              }}
            >
              <Text as="p" className="profile-block-title">
                Academic
                {basicFilled && (major.trim() === '' || graduationYear === '') && (
                  <span style={{ color: 'var(--error, red)', fontSize: '0.8rem' }}> * required</span>
                )}
              </Text>
              {showValidation && basicFilled && (!major.trim() || !graduationYear) && (
                <Text as="p" style={{ color: 'var(--error, red)', fontSize: '0.85rem', marginBottom: 8 }}>
                  Major and Graduation Year are required.
                </Text>
              )}
              <div className="profile-grid">
                <Input
                  label="Major *"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Enter your major"
                />
                <div>
                  <label className="input-label" htmlFor="graduation-year-trigger">Graduation Year *</label>
                  <div className="profile-dropdown" onClick={(e) => e.stopPropagation()}>
                    <button
                      id="graduation-year-trigger"
                      type="button"
                      className="profile-dropdown-trigger"
                      aria-haspopup="listbox"
                      aria-expanded={openMenu === 'graduationYear'}
                      onClick={() => setOpenMenu((current) => current === 'graduationYear' ? null : 'graduationYear')}
                    >
                      <span className={graduationYear ? '' : 'profile-dropdown-placeholder'}>
                        {graduationYear || 'Select graduation year'}
                      </span>
                    </button>
                    {openMenu === 'graduationYear' ? (
                      <div className="profile-dropdown-menu" role="listbox" aria-labelledby="graduation-year-trigger">
                        {graduationYearOptions.map((year) => (
                          <button
                            key={year}
                            type="button"
                            className={graduationYear === year ? 'profile-dropdown-option profile-dropdown-option--active' : 'profile-dropdown-option'}
                            onClick={() => { setGraduationYear(year); setOpenMenu(null) }}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Text as="p" className="profile-helper">Expected year you finish your degree.</Text>
                </div>
              </div>
            </div>

            <div className="profile-divider" />

            {/* About - greyed out until academic filled */}
            <div
              className="profile-block"
              style={{
                opacity: academicFilled ? 1 : 0.4,
                pointerEvents: academicFilled ? 'auto' : 'none'
              }}
            >
              <Text as="p" className="profile-block-title">About</Text>
              <div className="profile-grid">
                <div className="profile-span-full">
                  <label className="input-label" htmlFor="profile-bio">Bio</label>
                  <textarea
                    id="profile-bio"
                    className="input profile-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a short bio others can see..."
                    maxLength={bioCharacterLimit}
                    rows={5}
                  />
                  <Text as="p" className="profile-helper">{bio.length}/{bioCharacterLimit} characters</Text>
                </div>
              </div>
            </div>

          </Card>
        </section>

        <section className="profile-section">
          <Heading level={2} className="section-title">Event Preferences</Heading>
          <Card className="card card--elevated section-card mt-2">
            <div className="form-stack">
              <div>
                <Text as="p" className="mb-1">What kinds of events interest you most? *</Text>
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
                <Text as="p" className="mb-1">When do you usually want events? *</Text>
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
                <label className="input-label" htmlFor="event-size">What size events do you prefer? *</label>
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
                <label className="input-label" htmlFor="travel-distance-trigger">How far are you willing to travel? *</label>
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

              <div className="profile-actions">
                {savedMessage ? <Text as="p" className="status-active">{savedMessage}</Text> : <span />}
                <Button
                  className="btn--small profile-save-btn"
                  onClick={handleSave}
                  disabled={saving || loading || loadingCategories}
                >
                  {saving ? 'Saving...' : 'Save Profile & Preferences'}
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

export default Profile