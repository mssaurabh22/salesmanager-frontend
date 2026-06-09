export type Role = "ADMIN" | "EMPLOYEE";

export interface ApiEnvelope<T> {
  status: "success" | "error";
  message?: string | null;
  data: T;
}

export interface ValidationErrorData {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  validationErrors?: Record<string, string>;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface RefreshResponse {
  accessToken: string;
  tokenType: string;
}

export interface SessionUser {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  email: string;
  role: Role;
}

export interface Lead {
  id: number;
  customerName: string;
  businessName?: string | null;
  stage: LeadStage;
  weightage: number;
  temperature: LeadTemperature;
  expectedValue?: number | null;
  assignedTo?: number | null;
  activityCount?: number | null;
  lastActivityAt?: string | null;
}

export interface LeadRequest {
  customerName: string;
  businessName?: string;
  contactNumber: string;
  email?: string;
  expectedValue?: number;
}

export type LeadStage =
  | "SUSPECT"
  | "APPROACH"
  | "NEGOTIATION"
  | "CLOSURE"
  | "ORDER"
  | "LOST";

export type LeadTemperature = "COLD" | "WARM" | "HOT";

export interface LeadFilter {
  temperature?: LeadTemperature;
  stage?: LeadStage;
  assignedTo?: number;
  minValue?: number;
  maxValue?: number;
  search?: string;
  page: number;
  size: number;
  sortBy: string;
  sortDirection: "ASC" | "DESC";
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ReassignLeadRequest {
  leadIds: number[];
  assignedTo: number;
}

export interface UpdateStageRequest {
  stage: LeadStage;
}

export type ActivityType = "CALL" | "MEETING" | "WHATSAPP" | "EMAIL" | "NOTE";

export interface ActivityRequest {
  leadId: number;
  type: ActivityType;
  notes?: string;
  gpsLat?: number;
  gpsLong?: number;
}

export interface Activity {
  id: number;
  leadId: number;
  type: ActivityType;
  notes?: string | null;
  createdAt: string;
}

export interface FollowUpRequest {
  leadId: number;
  followUpTime: string;
}

export type FollowUpStatus = "PENDING" | "COMPLETED" | "MISSED";

export interface FollowUp {
  id: number;
  leadId: number;
  followUpTime: string;
  status: FollowUpStatus;
}

export interface EmployeeDashboard {
  todayFollowUps: number;
  missedFollowUps: number;
  totalLeads: number;
  activitiesToday: number;
}

export interface DashboardEmployeePerformance {
  employeeId: number;
  activitiesToday: number;
}

export interface OwnerDashboard {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  revenueForecast: number;
  employeePerformance: DashboardEmployeePerformance[];
}

export type TimelineAction =
  | "LEAD_CREATED"
  | "LEAD_UPDATED"
  | "STAGE_CHANGED"
  | "LEAD_REASSIGNED"
  | "ACTIVITY_CREATED"
  | "FOLLOW_UP_CREATED"
  | "FOLLOW_UP_COMPLETED"
  | "FOLLOW_UP_MISSED";

export interface TimelineEvent {
  id: number;
  leadId: number;
  userId: number;
  action: TimelineAction;
  description: string;
  timestamp: string;
}

export interface EmployeePerformanceReport {
  employeeId: number;
  leadsHandled: number;
  activitiesCount: number;
  conversionRate: number;
}

export interface LeadConversionReport {
  totalLeads: number;
  closedLeads: number;
  lostLeads: number;
  conversionRate: number;
}

export interface FollowUpComplianceReport {
  completedFollowUps: number;
  missedFollowUps: number;
  complianceRate: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  employeeCode?: string | null;
  department?: string | null;
  designation?: string | null;
  role: Role;
  active: boolean;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  phone: string;
  employeeCode?: string;
  department?: string;
  designation?: string;
  role: Role;
  active: boolean;
  password: string;
}
