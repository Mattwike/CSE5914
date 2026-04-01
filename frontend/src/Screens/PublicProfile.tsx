import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Card } from '../components/ui'

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
        setUserData(data)
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
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Heading level={1}>{username}</Heading>
              <button
                onClick={handleFollow}
                disabled={followLoading}
                style={{
                  padding: '6px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: following ? '#888' : '#3b82f6',
                  color: '#fff',
                  cursor: followLoading ? 'default' : 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {followLoading ? '…' : following ? 'Following' : 'Follow'}
              </button>
            </div>
            <Card className="card card--elevated mt-2">
              <div style={{ padding: '12px' }}>
                <Heading level={2} className="section-title">Bio</Heading>
                <Text as="p">{userData.bio}</Text>

                <Heading level={2} className="section-title" style={{ marginTop: 12 }}>Interests</Heading>
                {userData.interests && userData.interests.length ? (
                  <ul>
                    {userData.interests.map((it: string) => <li key={it}>{it}</li>)}
                  </ul>
                ) : (
                  <Text as="p">No public interests listed.</Text>
                )}

                <Text as="p" style={{ marginTop: 12, color: 'var(--muted)' }}>
                  Public profile — not editable.
                </Text>
              </div>
            </Card>
          </>
        ) : (
          <Heading level={2}>User not found</Heading>
        )}
      </MainContent>
    </PageWrapper>
  )
}

export default PublicProfile