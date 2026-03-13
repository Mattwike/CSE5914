import { request } from './api'

export async function createGroup(user_id: string, group_name: string) {
  return request(`/groups/${encodeURIComponent(user_id)}/create`, { method: 'POST', body: { group_name, user_id } })
}

export async function deleteGroup(group_id: string, user_id: string) {
  return request(`/groups/${encodeURIComponent(group_id)}/delete`, { method: 'DELETE', body: { group_name: '', user_id } })
}

export async function addMember(group_id: string, username: string, creater_id: string) {
  return request(`/groups/${encodeURIComponent(group_id)}/add`, { method: 'POST', body: { group_name: '', username, creater_id } })
}

export async function removeMember(group_id: string, username: string, creater_id: string) {
  return request(`/groups/${encodeURIComponent(group_id)}/delete/user/${encodeURIComponent(username)}`, { method: 'DELETE', body: { group_name: '', username, creater_id } })
}

export async function joinRequest(group_id: string, user_id: string, group_name: string) {
  return request(`/groups/group/${encodeURIComponent(group_id)}/join-request/${encodeURIComponent(user_id)}`, { method: 'POST', body: { group_name } })
}
