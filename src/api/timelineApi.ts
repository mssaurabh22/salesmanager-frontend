import { apiRequest } from '../lib/apiClient'
import type { SessionUser, TimelineEvent } from '../types/api'

export const timelineApi = {
  getByLead(session: SessionUser, leadId: number) {
    return apiRequest<TimelineEvent[]>(`/api/timeline/lead/${leadId}`, { session })
  },
}
