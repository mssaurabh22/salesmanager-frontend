import { apiRequest } from '../lib/apiClient'
import type { EmployeeDashboard, OwnerDashboard, SessionUser } from '../types/api'

export const dashboardApi = {
  getEmployeeDashboard(session: SessionUser) {
    return apiRequest<EmployeeDashboard>('/api/dashboard/employee', { session })
  },
  getOwnerDashboard(session: SessionUser) {
    return apiRequest<OwnerDashboard>('/api/dashboard/owner', { session })
  },
}
