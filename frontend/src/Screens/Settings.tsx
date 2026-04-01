import React, { useEffect, useState } from 'react'
import { PageWrapper, MainContent } from '../components/layout'
import { Button, Card, Heading, Text } from '../components/ui'
import { getCategories, type CategoryItem } from '../services/events'
import { getCategoryPreferences, saveCategoryPreferences } from '../services/preferences'

const Settings: React.FC = () => {
  const [preferenceMessage, setPreferenceMessage] = useState('')
  const [interests, setInterests] = useState<Array<string | number>>([])
  const [interestOptions, setInterestOptions] = useState<CategoryItem[]>([])
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
        const [categoriesData, preferencesData] = await Promise.all([
          getCategories(),
          getCategoryPreferences(userId),
        ])
        if (!isMounted) return
        setInterestOptions(categoriesData.categories)
        setInterests(preferencesData.category_ids)
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

  const toggleInterest = (categoryId: string | number) => {
    setInterests((current) =>
      current.includes(categoryId)
        ? current.filter((item) => item !== categoryId)
        : [...current, categoryId]
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
      const response = await saveCategoryPreferences({
        user_id: userId,
        category_ids: interests,
      })
      setPreferenceMessage(response?.message || 'Category preferences saved.')
    } catch (err: any) {
      setCategoryError(err?.message || 'Unable to save category preferences.')
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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {loadingCategories ? <Text as="p">Loading categories...</Text> : null}
                  {categoryError ? <Text as="p" className="error-text">{categoryError}</Text> : null}
                  {interestOptions.map((interest) => (
                    <label key={String(interest.id)} className="card" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px' }}>
                      <input
                        type="checkbox"
                        checked={interests.includes(interest.id)}
                        onChange={() => toggleInterest(interest.id)}
                      />
                      <span>{interest.name}</span>
                    </label>
                  ))}
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
