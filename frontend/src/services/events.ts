import { request } from './api'

export interface CategoryItem {
  id: string | number
  name: string
}

export interface CategoriesResponse {
  categories: CategoryItem[]
}

export type EventItem = {
  id: string
  title: string
  date?: string
  location?: string
  description?: string
  thumbnail?: string
  createdBy?: string
  createdById?: string | null
  capacity?: number | null
  currentCapacity?: number
  closeDate?: string | null
  isAttending?: boolean
}

export async function getCategories() {
  return request('/events/categories') as Promise<CategoriesResponse>
}

export async function getEvents(userId?: string) {
  if (userId) return request(`/events/${encodeURIComponent(userId)}/event`)
  // no userId -> maybe return all events; backend is partial so call root
  return request('/events')
}

export async function getEventById(id: string) {
  return request(`/events/${encodeURIComponent(id)}`)
}

export async function createEvent(userId: string, payload: any) {
  return request(`/events/${encodeURIComponent(userId)}/create`, { method: 'POST', body: payload })
}

export async function modifyEvent(eventId: string, payload: any) {
  return request(`/events/${encodeURIComponent(eventId)}/modify`, { method: 'POST', body: payload })
}

export async function getJoinedEvents() {
  return request('/events/joined') as Promise<EventItem[]>
}

export async function joinEvent(eventId: string) {
  return request(`/events/${encodeURIComponent(eventId)}/join`, { method: 'POST' })
}

export async function leaveEvent(eventId: string) {
  return request(`/events/${encodeURIComponent(eventId)}/leave`, { method: 'POST' })
}

export async function getAttendees(eventId: string) {
  return request(`/events/${encodeURIComponent(eventId)}/attendees`)
}
