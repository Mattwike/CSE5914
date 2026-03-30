import { request } from './api'

export async function getRecommendations(userID: string) {
  return request(`/recommendations/get_recommendations?userID=${encodeURIComponent(userID)}`)
}

export async function reviewRecommendation(userID: string, eventID: string, rating: number) {
  return request('/recommendations/review_recommendation', { method: 'POST', body: { userID, eventID, rating } })
}
