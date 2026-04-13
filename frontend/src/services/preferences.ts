import { request } from './api'

export interface CategoryPreferencesResponse {
  category_ids: Array<string | number>
}

export interface SaveCategoryPreferencesRequest {
  user_id: string
  category_ids: Array<string | number>
}

export interface UserPreferencesResponse {
  event_size: 'small' | 'medium' | 'large' | 'mega'
  event_distance: 0 | 1 | 2
  event_times: number[]
}

export interface SaveUserPreferencesRequest {
  user_id: string
  event_size: 'small' | 'medium' | 'large' | 'mega'
  event_distance: 0 | 1 | 2
  event_times: number[]
}

export async function getCategoryPreferences(userId: string) {
  return request(`/preferences/categories?user_id=${encodeURIComponent(userId)}`) as Promise<CategoryPreferencesResponse>
}

export async function saveCategoryPreferences(payload: SaveCategoryPreferencesRequest) {
  return request('/preferences/categories', { method: 'PUT', body: payload })
}

export async function getUserPreferences(userId: string) {
  return request(`/preferences?user_id=${encodeURIComponent(userId)}`) as Promise<UserPreferencesResponse>
}

export async function saveUserPreferences(payload: SaveUserPreferencesRequest) {
  return request('/preferences', { method: 'PUT', body: payload })
}
