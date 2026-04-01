import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper, MainContent } from '../components/layout'
import { Heading, Text, Button, LazyImage, Input } from '../components/ui'
import GroupHero from '../components/groups/GroupHero'
import { useAuthContext } from '../context/AuthContext'
import * as groupsService from '../services/groups'
import type { Group, GroupMember, JoinRequest } from '../services/groups'
import { request } from '../services/api'
import '../styles/groups.css'

const GroupDetail: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthContext()

  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<GroupMember[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [groupEvents, setGroupEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState('')

  // Edit mode state
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editJoinPolicy, setEditJoinPolicy] = useState('open')

  // Add event state
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [eventSearch, setEventSearch] = useState('')
  const [eventsLoading, setEventsLoading] = useState(false)

  // Kick confirmation
  const [kickConfirmId, setKickConfirmId] = useState<string | null>(null)

  const myMembership = members.find((m) => m.user_id === user?.user_id)
  const isOwner = myMembership?.role === 'owner'
  const isAdmin = myMembership?.role === 'admin'
  const canManage = isOwner || isAdmin

  const loadGroup = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [groupData, membersData, eventsData] = await Promise.all([
        groupsService.getGroup(id),
        groupsService.listMembers(id),
        groupsService.listGroupEvents(id),
      ])
      setGroup(groupData?.group || null)
      setMembers(membersData?.members || [])
      setGroupEvents(eventsData?.events || [])

      // Fetch join requests (will 403 if not owner/admin, that's fine)
      try {
        const reqData = await groupsService.listJoinRequests(id)
        setJoinRequests(reqData?.requests || [])
      } catch {
        setJoinRequests([])
      }
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

  // --- Actions ---

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

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = async () => {
    if (!id) return
    setShowDeleteConfirm(false)
    setActionLoading(true)
    try {
      await groupsService.deleteGroup(id)
      navigate('/groups')
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to delete group')
      setActionLoading(false)
    }
  }

  // --- Member Management ---

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!id) return
    setActionLoading(true)
    try {
      await groupsService.updateMemberRole(id, userId, newRole)
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to update role')
    } finally {
      setActionLoading(false)
    }
  }

  const handleKick = async (userId: string) => {
    if (!id) return
    setKickConfirmId(null)
    setActionLoading(true)
    try {
      await groupsService.kickMember(id, userId)
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to remove member')
    } finally {
      setActionLoading(false)
    }
  }

  // --- Join Requests ---

  const handleApprove = async (requestId: string) => {
    if (!id) return
    setActionLoading(true)
    try {
      await groupsService.approveJoinRequest(id, requestId)
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to approve request')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!id) return
    setActionLoading(true)
    try {
      await groupsService.rejectJoinRequest(id, requestId)
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to reject request')
    } finally {
      setActionLoading(false)
    }
  }

  // --- Edit Group ---

  const startEditing = () => {
    if (!group) return
    setEditName(group.name)
    setEditDescription(group.description || '')
    setEditJoinPolicy(group.join_policy)
    setEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!id) return
    setActionLoading(true)
    try {
      await groupsService.updateGroup(id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        join_policy: editJoinPolicy,
      })
      setEditing(false)
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to update group')
    } finally {
      setActionLoading(false)
    }
  }

  // --- Group Events ---

  const handleAddEvent = async (eventId: string) => {
    if (!id) return
    setActionLoading(true)
    try {
      await groupsService.addGroupEvent(id, eventId)
      setShowAddEvent(false)
      setEventSearch('')
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to add event')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRemoveEvent = async (eventId: string) => {
    if (!id) return
    setActionLoading(true)
    try {
      await groupsService.removeGroupEvent(id, eventId)
      await loadGroup()
    } catch (e: any) {
      setActionMessage(e?.message || 'Failed to remove event')
    } finally {
      setActionLoading(false)
    }
  }

  const loadAllEvents = async () => {
    setEventsLoading(true)
    try {
      const data = await request('/events')
      setAllEvents(Array.isArray(data) ? data : [])
    } catch {
      setAllEvents([])
    } finally {
      setEventsLoading(false)
    }
  }

  const openAddEvent = () => {
    setShowAddEvent(true)
    loadAllEvents()
  }

  const filteredAvailableEvents = allEvents.filter((e) => {
    const alreadyLinked = groupEvents.some((ge) => ge.id === e.id)
    if (alreadyLinked) return false
    if (eventSearch.trim()) {
      return e.title?.toLowerCase().includes(eventSearch.toLowerCase())
    }
    return true
  })

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
              {/* Header — view or edit mode */}
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <Input label="Group Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <div>
                    <label className="input-label" htmlFor="edit-desc">Description</label>
                    <textarea id="edit-desc" className="input" rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  </div>
                  <div>
                    <label className="input-label" htmlFor="edit-policy">Join Policy</label>
                    <select id="edit-policy" className="input" value={editJoinPolicy} onChange={(e) => setEditJoinPolicy(e.target.value)}>
                      <option value="open">Open</option>
                      <option value="approval">Approval Required</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <Button onClick={handleSaveEdit} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</Button>
                    <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Heading level={1} className="detail-title">{group.name}</Heading>
                    {isOwner && (
                      <Button variant="ghost" onClick={startEditing} style={{ flexShrink: 0 }}>Edit</Button>
                    )}
                  </div>

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
                </>
              )}

              {/* Actions */}
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

                {isOwner && !showDeleteConfirm && (
                  <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} disabled={actionLoading}>
                    Delete Group
                  </Button>
                )}
              </div>

              {showDeleteConfirm && (
                <div className="card" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <Text as="span">Are you sure? This cannot be undone.</Text>
                  <Button variant="danger" onClick={handleDelete} disabled={actionLoading}>
                    {actionLoading ? 'Deleting...' : 'Yes, delete'}
                  </Button>
                  <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                </div>
              )}

              {actionMessage && (
                <Text as="p" className="status-active" style={{ marginTop: 'var(--space-sm)' }}>{actionMessage}</Text>
              )}

              {/* Join Requests (owner/admin only, approval groups) */}
              {canManage && group.join_policy === 'approval' && joinRequests.length > 0 && (
                <div style={{ marginTop: 'var(--space-xl)' }}>
                  <Heading level={2}>Pending Requests ({joinRequests.length})</Heading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                    {joinRequests.map((jr) => (
                      <div
                        key={jr.id}
                        className="card"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) var(--space-md)' }}
                      >
                        <div>
                          <Text as="span" style={{ fontWeight: 600 }}>{jr.display_name || jr.email}</Text>
                          <Text as="span" style={{ marginLeft: 'var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            {new Date(jr.created_at).toLocaleDateString()}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                          <Button onClick={() => handleApprove(jr.id)} disabled={actionLoading}>Approve</Button>
                          <Button variant="ghost" onClick={() => handleReject(jr.id)} disabled={actionLoading}>Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) var(--space-md)' }}
                      >
                        <div>
                          <Text as="span" style={{ fontWeight: 600 }}>{m.display_name || m.email}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                          {/* Role badge or dropdown */}
                          {canManage && m.role !== 'owner' ? (
                            <select
                              className="input"
                              value={m.role}
                              onChange={(e) => handleRoleChange(m.user_id, e.target.value)}
                              disabled={actionLoading}
                              style={{ fontSize: 'var(--text-xs)', padding: '2px 6px', width: 'auto' }}
                            >
                              <option value="member">member</option>
                              <option value="admin">admin</option>
                            </select>
                          ) : (
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
                          )}

                          {/* Kick button */}
                          {canManage && m.role !== 'owner' && m.user_id !== user?.user_id && (
                            kickConfirmId === m.user_id ? (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <Button variant="danger" onClick={() => handleKick(m.user_id)} disabled={actionLoading} style={{ fontSize: 'var(--text-xs)', padding: '2px 8px' }}>
                                  Confirm
                                </Button>
                                <Button variant="ghost" onClick={() => setKickConfirmId(null)} style={{ fontSize: 'var(--text-xs)', padding: '2px 8px' }}>
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" onClick={() => setKickConfirmId(m.user_id)} disabled={actionLoading} style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', color: 'var(--color-danger, red)' }}>
                                Remove
                              </Button>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Group Events */}
              <div style={{ marginTop: 'var(--space-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Heading level={2}>Group Events</Heading>
                  {canManage && (
                    <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                      <Button onClick={() => navigate(`/events/create?groupId=${id}`)}>Create Event</Button>
                      <Button variant="ghost" onClick={openAddEvent} disabled={actionLoading}>Link Existing</Button>
                    </div>
                  )}
                </div>

                {showAddEvent && (
                  <div className="card" style={{ padding: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                    <Input
                      label="Search events"
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      placeholder="Type to search..."
                    />
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: 'var(--space-sm)' }}>
                      {eventsLoading ? (
                        <Text as="p">Loading events...</Text>
                      ) : filteredAvailableEvents.length === 0 ? (
                        <Text as="p" style={{ color: 'var(--color-text-muted)' }}>No events available to add.</Text>
                      ) : (
                        filteredAvailableEvents.slice(0, 10).map((e) => (
                          <div
                            key={e.id}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-xs) 0', borderBottom: '1px solid var(--color-border)' }}
                          >
                            <div>
                              <Text as="span" style={{ fontWeight: 600 }}>{e.title}</Text>
                              {e.date && <Text as="span" style={{ marginLeft: 'var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{new Date(e.date).toLocaleDateString()}</Text>}
                            </div>
                            <Button onClick={() => handleAddEvent(e.id)} disabled={actionLoading} style={{ fontSize: 'var(--text-xs)', padding: '2px 8px' }}>
                              Add
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    <Button variant="ghost" onClick={() => { setShowAddEvent(false); setEventSearch('') }} style={{ marginTop: 'var(--space-sm)' }}>Close</Button>
                  </div>
                )}

                {groupEvents.length === 0 ? (
                  <Text as="p" style={{ marginTop: 'var(--space-sm)' }}>No events linked to this group yet.</Text>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginTop: 'var(--space-sm)' }}>
                    {groupEvents.map((e) => (
                      <div
                        key={e.id}
                        className="card"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) var(--space-md)', cursor: 'pointer' }}
                        onClick={() => navigate(`/events/${e.id}`)}
                      >
                        <div>
                          <Text as="span" style={{ fontWeight: 600 }}>{e.title}</Text>
                          {e.start_time && (
                            <Text as="span" style={{ marginLeft: 'var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                              {new Date(e.start_time).toLocaleDateString()}
                            </Text>
                          )}
                          {e.location_name && (
                            <Text as="span" style={{ marginLeft: 'var(--space-sm)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                              {e.location_name}
                            </Text>
                          )}
                        </div>
                        {canManage && (
                          <Button
                            variant="ghost"
                            onClick={(ev) => { ev.stopPropagation(); handleRemoveEvent(e.id) }}
                            disabled={actionLoading}
                            style={{ fontSize: 'var(--text-xs)', padding: '2px 8px', color: 'var(--color-danger, red)' }}
                          >
                            Remove
                          </Button>
                        )}
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
