import React, { useEffect, useState } from 'react'
import { PageWrapper, MainContent } from '../components/layout'
import { Button, Card, Heading, Input, Text } from '../components/ui'
import '../styles/profile.css'
import { getProfile, updateProfile } from '../services/auth'

const Profile: React.FC = () => {
  const bioCharacterLimit = 280
  const graduationYearOptions = Array.from({ length: 8 }, (_, index) => String(new Date().getFullYear() + index))
  const hasCarOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ]
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
  const [openMenu, setOpenMenu] = useState<'graduationYear' | 'hasCar' | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (!userId) {
      setError('No logged-in user found. Please log in again.')
      setLoading(false)
      return
    }

    const storedUserId = userId
    let isMounted = true

    async function loadProfile() {
      try {
        const profile = await getProfile(storedUserId)
        if (!isMounted) return

        setUserId(profile.id)
        setEmail(profile.email ?? '')
        setIsVerified(Boolean(profile.verified))
        setDisplayName(profile.display_name ?? '')
        setBirthDate(profile.birth_date ?? '')
        setGraduationYear(profile.graduation_year != null ? String(profile.graduation_year) : '')
        setMajor(profile.major ?? '')
        setHasCar(Boolean(profile.has_car))
        setBio(profile.bio ?? '')
        setError('')
      } catch (err: any) {
        if (!isMounted) return
        setError(err?.message || 'Unable to load profile.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProfile()

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

  const handleSave = async () => {
    if (!userId) {
      setError('No logged-in user found. Please log in again.')
      return
    }

    setSaving(true)
    setSavedMessage('')
    setError('')

    try {
      const updatedProfile = await updateProfile({
        id: userId,
        display_name: displayName,
        birth_date: birthDate || null,
        graduation_year: graduationYear ? Number(graduationYear) : null,
        major,
        has_car: hasCar,
        bio,
      })

      setUserId(updatedProfile.id)
      setEmail(updatedProfile.email ?? '')
      setIsVerified(Boolean(updatedProfile.verified))
      setDisplayName(updatedProfile.display_name ?? '')
      setBirthDate(updatedProfile.birth_date ?? '')
      setGraduationYear(updatedProfile.graduation_year != null ? String(updatedProfile.graduation_year) : '')
      setMajor(updatedProfile.major ?? '')
      setHasCar(Boolean(updatedProfile.has_car))
      setBio(updatedProfile.bio ?? '')
      setSavedMessage('Profile changes saved.')
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
        <Text as="p" className="mb-1">Update your profile details below.</Text>

        {loading ? <Text as="p">Loading profile...</Text> : null}
        {error ? <Text as="p" className="error-text">{error}</Text> : null}

        <section className="profile-section" aria-busy={loading}>
          <Heading level={2} className="section-title">Profile Details</Heading>
          <Card className="card card--elevated section-card mt-2 profile-card">
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

            <div className="profile-block">
              <Text as="p" className="profile-block-title">Basic</Text>
              <div className="profile-grid">
                <Input
                  label="Display Name"
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
                            onClick={() => {
                              setHasCar(option.value)
                              setOpenMenu(null)
                            }}
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

            <div className="profile-block">
              <Text as="p" className="profile-block-title">Academic</Text>
              <div className="profile-grid">
                <Input
                  label="Major"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Enter your major"
                />

                <div>
                  <label className="input-label" htmlFor="graduation-year-trigger">Graduation Year</label>
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
                            onClick={() => {
                              setGraduationYear(year)
                              setOpenMenu(null)
                            }}
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

            <div className="profile-block">
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

            <div className="profile-actions">
              {savedMessage ? <Text as="p" className="status-active">{savedMessage}</Text> : <span />}
              <Button className="btn--small profile-save-btn" onClick={handleSave} disabled={saving || loading}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Card>
        </section>
      </MainContent>
    </PageWrapper>
  )
}

export default Profile
