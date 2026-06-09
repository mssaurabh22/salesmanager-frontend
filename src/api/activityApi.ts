import { apiRequest } from '../lib/apiClient'
import type { Activity, SessionUser } from '../types/api'

export const activityApi = {
  getMine(session: SessionUser) {
    return apiRequest<Activity[]>('/api/activities/user', { session })
  },
  create(
    session: SessionUser,
    payload: {
      leadId: number
      type: string
      notes: string
      gpsLat?: number
      gpsLong?: number
    },
  ) {
    return apiRequest<Activity>('/api/activities', {
      method: 'POST',
      session,
      body: payload,
    })
  },
}
