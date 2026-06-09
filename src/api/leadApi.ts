import { apiRequest } from '../lib/apiClient'
import type { Lead, LeadPage, SessionUser } from '../types/api'

export const leadApi = {
  search(session: SessionUser, search = '') {
    return apiRequest<LeadPage>('/api/leads/search', {
      method: 'POST',
      session,
      body: {
        search,
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      },
    })
  },
  create(
    session: SessionUser,
    payload: {
      customerName: string
      businessName?: string
      contactNumber: string
      email?: string
      expectedValue?: number
    },
  ) {
    return apiRequest<Lead>('/api/leads', {
      method: 'POST',
      session,
      body: payload,
    })
  },
  reassign(session: SessionUser, leadIds: number[], assignedTo: number) {
    return apiRequest<Lead[]>('/api/leads/reassign', {
      method: 'PUT',
      session,
      body: { leadIds, assignedTo },
    })
  },
}
