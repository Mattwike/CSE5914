import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Button, LazyImage } from '../components/ui'
import GroupHero from '../components/groups/GroupHero'
import { useAuthContext } from '../context/AuthContext'
import * as groupsService from '../services/groups'
import type { Group, GroupMember } from '../services/groups'
import '../styles/groups.css'

const GroupDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()

  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  const myMembership = members.find((m) => m.user_id === user?.user_id)
  const isOwner = myMembership?.role === 'owner'

  const loadGroup = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [groupData, membersData] = await Promise.all([
        groupsService.getGroup(id),
        groupsService.listMembers(id),
      ])
      setGroup(groupData?.group || null)
      setMembers(membersData?.members || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load group')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    let mounted = true
    loadGroup().then(() => { if (!mounted) return })
    return () => { mounted = false }
  }, [loadGroup])

  const handleJoin = async () => {
    if (!id) return
    setActionLoading(true)
    setActionMessage('')
    try {
      const result = await groupsService.joinGroup(id)
      setActionMessage(result?.message || 'Joined!')
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to join group')
    } finally {
      setActionLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!id) return
    setActionLoading(true)
    setActionMessage('')
    try {
      await groupsService.leaveGroup(id)
      setActionMessage('Left group')
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to leave group')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this group? This cannot be undone.')) return
    setActionLoading(true)
    try {
      await groupsService.deleteGroup(id)
      navigate('/groups')
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to delete group')
      setActionLoading(false)
    }
  }

  return (
    <PageWrapper>
      <MainContent>
        <GroupHero />

        <div className="detail-card detail-card--centered">
          {loading ? (
            <Heading level={2}>Loading...</Heading>
          ) : error ? (
            <div>
              <Heading level={2}>Error</Heading>
              <Text as="div">{error}</Text>
              <div className="event-actions">
                <Button onClick={() => navigate(-1)}>Back</Button>
              </div>
            </div>
          ) : group ? (
            <>
              <Heading level={1} className="detail-title">{group.name}</Heading>

              <div className="detail-thumb-wrap">
                <LazyImage src={group.image_url || '/block.jpg'} alt={group.name} width={420} height={240} className="detail-thumb" />
              </div>

              <div className="detail-meta">
                <div className="detail-stats">
                  {group.member_count} member{group.member_count !== 1 ? 's' : ''} · {group.join_policy === 'open' ? 'Open group' : 'Approval required'}
                </div>
                {group.creator_display_name && (
                  <div className="detail-location">Created by {group.creator_display_name}</div>
                )}
              </div>

              <div className="detail-description">
                <Text as="div">{group.description || 'No description provided.'}</Text>
              </div>

              {/* Join / Leave / Delete actions */}
              <div className="event-actions" style={{ gap: 'var(--space-sm)' }}>
                <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>

                {!myMembership && (
                  <Button onClick={handleJoin} disabled={actionLoading}>
                    {actionLoading ? 'Joining...' : group.join_policy === 'open' ? 'Join Group' : 'Request to Join'}
                  </Button>
                )}

                {myMembership && !isOwner && (
                  <Button variant="ghost" onClick={handleLeave} disabled={actionLoading}>
                    {actionLoading ? 'Leaving...' : 'Leave Group'}
                  </Button>
                )}

                {isOwner && (
                  <Button variant="danger" onClick={handleDelete} disabled={actionLoading}>
                    Delete Group
                  </Button>
                )}
              </div>

              {actionMessage && (
                <Text as="p" className="status-active" style={{ marginTop: 'var(--space-sm)' }}>{actionMessage}</Text>
              )}

              {/* Members list */}
              <div style={{ marginTop: 'var(--space-xl)' }}>
                <Heading level={2}>Members</Heading>
                {members.length === 0 ? (
                  <Text as="p">No members yet.</Text>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    {members.map((m) => (
                      <div
                        key={m.user_id}
                        className="card"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 'var(--space-sm) var(--space-md)',
                        }}
                      >
                        <div>
                          <Text as="span" style={{ fontWeight: 600 }}>
                            {m.display_name || m.email}
                          </Text>
                        </div>
                        <Text
                          as="span"
                          style={{
                            fontSize: 'var(--text-xs)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: m.role === 'owner'
                              ? 'var(--color-primary)'
                              : m.role === 'admin'
                                ? 'var(--color-text-muted)'
                                : 'var(--color-border)',
                            color: m.role === 'owner' || m.role === 'admin' ? '#fff' : 'var(--color-text)',
                          }}
                        >
                          {m.role}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <Heading level={2}>Group not found</Heading>
              <div className="event-actions">
                <Button onClick={() => navigate(-1)}>Back</Button>
              </div>
            </div>
          )}
        </div>
      </MainContent>
    </PageWrapper>
  )
}

export default GroupDetail
