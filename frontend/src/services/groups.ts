import { request } from './api'

export type Group = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  join_policy: 'open' | 'approval'
  created_by: string
  created_at: string
  updated_at?: string
  member_count: number
  creator_email?: string
  creator_display_name?: string
  my_role?: string
}

export type GroupMember = {
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
  email: string
  display_name: string | null
}

export type JoinRequest = {
  id: string
  group_id: string
  user_id: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  email: string
  display_name: string | null
}

// --- Group CRUD ---

export async function createGroup(data: {
  name: string
  description?: string
  image_url?: string
  join_policy?: string
}) {
  return request('/groups/create', { method: 'POST', body: data })
}

export async function getGroup(groupId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}`)
}

export async function listGroups(params?: { q?: string; limit?: number; offset?: number }) {
  const query = new URLSearchParams()
  if (params?.q) query.set('q', params.q)
  if (params?.limit) query.set('limit', String(params.limit))
  if (params?.offset) query.set('offset', String(params.offset))
  const qs = query.toString()
  return request(`/groups${qs ? `?${qs}` : ''}`)
}

export async function myGroups() {
  return request('/groups/my')
}

export async function deleteGroup(groupId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}`, { method: 'DELETE' })
}

export async function updateGroup(groupId: string, data: {
  name?: string
  description?: string
  join_policy?: string
}) {
  return request(`/groups/${encodeURIComponent(groupId)}`, { method: 'PUT', body: data })
}

// --- Join / Leave ---

export async function joinGroup(groupId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/join`, { method: 'POST' })
}

export async function leaveGroup(groupId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/leave`, { method: 'POST' })
}

// --- Members ---

export async function listMembers(groupId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/members`)
}

export async function updateMemberRole(groupId: string, userId: string, role: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}/role`, {
    method: 'PUT',
    body: { role },
  })
}

export async function kickMember(groupId: string, userId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  })
}

// --- Join Requests ---

export async function listJoinRequests(groupId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/join-requests`)
}

export async function approveJoinRequest(groupId: string, requestId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/join-requests/${encodeURIComponent(requestId)}/approve`, {
    method: 'POST',
  })
}

export async function rejectJoinRequest(groupId: string, requestId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/join-requests/${encodeURIComponent(requestId)}/reject`, {
    method: 'POST',
  })
}

// --- Group Events ---

export async function addGroupEvent(groupId: string, eventId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/events/${encodeURIComponent(eventId)}`, {
    method: 'POST',
  })
}

export async function removeGroupEvent(groupId: string, eventId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
  })
}

export async function listGroupEvents(groupId: string) {
  return request(`/groups/${encodeURIComponent(groupId)}/events`)
}
