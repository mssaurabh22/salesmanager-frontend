import { apiRequest } from '../lib/apiClient'
import type { FollowUp, SessionUser } from '../types/api'

export const followupApi = {
  getToday(session: SessionUser) {
    return apiRequest<FollowUp[]>('/api/followups/today', { session })
  },
  getMissed(session: SessionUser) {
    return apiRequest<FollowUp[]>('/api/followups/missed', { session })
  },
  create(session: SessionUser, leadId: number, followUpTime: string) {
    return apiRequest<FollowUp>('/api/followups', {
      method: 'POST',
      session,
      body: { leadId, followUpTime },
    })
  },
}
