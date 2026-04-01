import { request } from './api'

export interface CategoryPreferencesResponse {
  category_ids: Array<string | number>
}

export interface SaveCategoryPreferencesRequest {
  user_id: string
  category_ids: Array<string | number>
}

export async function getCategoryPreferences(userId: string) {
  return request(`/preferences/categories?user_id=${encodeURIComponent(userId)}`) as Promise<CategoryPreferencesResponse>
}

export async function saveCategoryPreferences(payload: SaveCategoryPreferencesRequest) {
  return request('/preferences/categories', { method: 'PUT', body: payload })
}
