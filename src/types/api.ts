export type ApiResponse<T> = {
  status: string
  message?: string | null
  data: T
}

export type AuthResponse = {
  accessToken: string
  refreshToken: string
  tokenType: string
}

export type JwtClaims = {
  sub: string
  userId: number
  role: 'ADMIN' | 'EMPLOYEE'
  exp: number
  iat: number
}

export type SessionUser = {
  userId: number
  email: string
  role: 'ADMIN' | 'EMPLOYEE'
  accessToken: string
  refreshToken: string
}

export type Lead = {
  id: number
  customerName: string
  businessName: string
  stage: string
  weightage: number
  temperature: string
  expectedValue: number
}

export type LeadPage = {
  content: Lead[]
}

export type EmployeeDashboard = {
  todayFollowUps: number
  missedFollowUps: number
  totalLeads: number
  activitiesToday: number
}

export type OwnerEmployeePerformance = {
  employeeId: number
  activitiesToday: number
}

export type OwnerDashboard = {
  totalLeads: number
  hotLeads: number
  warmLeads: number
  coldLeads: number
  revenueForecast: number
  employeePerformance: OwnerEmployeePerformance[]
}

export type Activity = {
  id: number
  leadId: number
  type: string
  notes: string
  createdAt: string
}

export type FollowUp = {
  id: number
  leadId: number
  followUpTime: string
  status: string
}

export type TimelineEvent = {
  id: number
  leadId: number
  userId: number
  action: string
  description: string
  timestamp: string
}

export type EmployeePerformanceReport = {
  employeeId: number
  leadsHandled: number
  activitiesCount: number
  conversionRate: number
}
