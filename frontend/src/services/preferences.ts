import { request } from './api'

export interface SaveCategoryPreferencesRequest {
  user_id: string
  category_ids: Array<string | number>
}

export async function saveCategoryPreferences(payload: SaveCategoryPreferencesRequest) {
  return request('/preferences/categories', { method: 'PUT', body: payload })
}
