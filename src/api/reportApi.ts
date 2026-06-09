import { apiRequest } from '../lib/apiClient'
import type { EmployeePerformanceReport, SessionUser } from '../types/api'

export const reportApi = {
  getEmployeePerformance(session: SessionUser) {
    return apiRequest<EmployeePerformanceReport[]>('/api/reports/employee-performance', {
      session,
    })
  },
}
