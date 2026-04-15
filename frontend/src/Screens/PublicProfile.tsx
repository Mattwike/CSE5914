import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Card, Button, LazyImage } from '../components/ui'

const PublicProfile: React.FC = () => {
  const { username } = useParams()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [following, setFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (!username) throw new Error('No username provided')
        const { request } = await import('../services/api')
        const [data, followData] = await Promise.all([
          request(`/follow/${encodeURIComponent(username)}/publicProfile`),
          request(`/follow/${encodeURIComponent(username)}/isFollowing`).catch(() => ({ following: false }))
        ])
        if (!mounted) return
        // Normalize response: ensure interests is an array
        try { console.debug('publicProfile response:', data) } catch {}
        const normalized = { ...data }
        if (normalized && normalized.interests && typeof normalized.interests === 'string') {
          try { normalized.interests = JSON.parse(normalized.interests) } catch { normalized.interests = [] }
        }
        setUserData(normalized)
        setFollowing(followData.following)
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load user')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [username])

  async function handleFollow() {
    if (!username || followLoading) return
    setFollowLoading(true)
    try {
      const { request } = await import('../services/api')
      if (following) {
        await request(`/follow/${encodeURIComponent(username)}`, { method: 'DELETE' })
        setFollowing(false)
      } else {
        await request(`/follow/${encodeURIComponent(username)}`, { method: 'POST' })
        setFollowing(true)
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to update follow status')
    } finally {
      setFollowLoading(false)
    }
  }

  return (
    <PageWrapper>
      <MainContent>
        {loading ? (
          <Heading level={2}>Loading…</Heading>
        ) : error ? (
          <div>
            <Heading level={2}>Error</Heading>
            <Text as="div">{error}</Text>
          </div>
        ) : userData ? (
          <div className="detail-card detail-card--centered">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <LazyImage src={userData.avatar || '/block.jpg'} alt={username || 'profile'} width={96} height={96} className="detail-avatar" />
                <div>
                  <Heading level={1}>{username}</Heading>
                  <Text as="p" style={{ color: 'var(--muted)' }}>
                    {userData.major ? userData.major : ''}{(userData.major && (userData.graduation_year || userData.graduationYear)) ? ' • ' : ''}{userData.graduation_year ?? userData.graduationYear ?? ''}
                  </Text>
                </div>
              </div>

              <div>
                <Button onClick={handleFollow} disabled={followLoading} className={following ? 'btn--secondary' : ''}>
                  {followLoading ? '…' : following ? 'Following' : 'Follow'}
                </Button>
              </div>
            </div>

            <Card className="card card--elevated mt-2">
              <div style={{ padding: 12 }}>
                <Heading level={2} className="section-title">Bio</Heading>
                <Text as="p">{userData.bio || 'No bio provided.'}</Text>

                <Heading level={2} className="section-title" style={{ marginTop: 12 }}>Interests</Heading>
                {userData.interests && userData.interests.length ? (
                  <Text as="p">{(userData.interests || []).join(', ')}</Text>
                ) : (
                  <Text as="p">No public interests listed.</Text>
                )}

                <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
                  <Text as="p" style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Verified:</strong>
                    <span aria-hidden style={{ color: userData.verified ? 'var(--ok, #16a34a)' : 'var(--error, #dc2626)' }}>
                      {userData.verified ? '✔' : '✖'}
                    </span>
                  </Text>

                  <Text as="p" style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong>Has car:</strong>
                    <span aria-hidden style={{ color: userData.has_car ? 'var(--ok, #16a34a)' : 'var(--error, #dc2626)' }}>
                      {userData.has_car ? '✔' : '✖'}
                    </span>
                  </Text>
                </div>

                <Text as="p" style={{ marginTop: 12, color: 'var(--muted)' }}>
                  Public profile — not editable.
                </Text>
              </div>
            </Card>
          </div>
        ) : (
          <Heading level={2}>User not found</Heading>
        )}
      </MainContent>
    </PageWrapper>
  )
}

export default PublicProfile