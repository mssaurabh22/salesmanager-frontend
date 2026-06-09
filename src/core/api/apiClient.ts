import type {
  Activity,
  ActivityRequest,
  ApiEnvelope,
  AuthResponse,
  CreateEmployeeRequest,
  EmployeeDashboard,
  EmployeePerformanceReport,
  FollowUp,
  FollowUpComplianceReport,
  FollowUpRequest,
  Lead,
  LeadConversionReport,
  LeadFilter,
  LeadRequest,
  OwnerDashboard,
  PageResponse,
  ReassignLeadRequest,
  RefreshResponse,
  SessionUser,
  TimelineEvent,
  UpdateStageRequest,
  UserProfile,
  ValidationErrorData,
} from "./types";

export class ApiError extends Error {
  status: number;
  details?: ValidationErrorData;

  constructor(message: string, status: number, details?: ValidationErrorData) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const SESSION_KEY = "salesmanager.session";

function readSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

function writeSession(session: SessionUser | null) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const part = token.split(".")[1];

  if (!part) {
    throw new Error("Invalid token payload");
  }

  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return JSON.parse(atob(padded)) as Record<string, unknown>;
}

function parseLoginPayload(payload: AuthResponse): SessionUser {
  const claims = decodeJwtPayload(payload.accessToken);
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    tokenType: payload.tokenType ?? "Bearer",
    userId: Number(claims.userId),
    email: String(claims.sub ?? ""),
    role: String(claims.role ?? "EMPLOYEE") as SessionUser["role"],
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const body = contentType?.includes("application/json")
    ? ((await response.json()) as ApiEnvelope<T> | ValidationErrorData)
    : null;

  if (!response.ok) {
    const envelope = body as ApiEnvelope<ValidationErrorData> | null;
    const message =
      envelope?.message ||
      envelope?.data?.message ||
      (body as ValidationErrorData | null)?.message ||
      `Request failed with status ${response.status}`;
    const details =
      envelope && "data" in envelope ? envelope.data : (body as ValidationErrorData | null) ?? undefined;
    throw new ApiError(message, response.status, details);
  }

  if (!body) {
    return undefined as T;
  }

  if ("status" in body && "data" in body) {
    return (body as ApiEnvelope<T>).data;
  }

  return body as T;
}

type RequestMethod = "GET" | "POST" | "PUT";

class ApiClient {
  private refreshPromise: Promise<SessionUser | null> | null = null;

  private async request<T>(method: RequestMethod, path: string, body?: unknown, skipRefresh = false): Promise<T> {
    const session = readSession();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(session?.accessToken
          ? { Authorization: `${session.tokenType} ${session.accessToken}` }
          : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && !skipRefresh && session?.refreshToken) {
      const refreshed = await this.refreshSession(session.refreshToken);

      if (!refreshed) {
        throw new ApiError("Your session has expired. Please log in again.", 401);
      }

      return this.request<T>(method, path, body, true);
    }

    return parseResponse<T>(response);
  }

  private async refreshSession(refreshToken: string): Promise<SessionUser | null> {
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });
          const data = await parseResponse<RefreshResponse>(response);
          const current = readSession();

          if (!current) {
            return null;
          }

          const nextSession = parseLoginPayload({
            accessToken: data.accessToken,
            refreshToken: current.refreshToken,
            tokenType: data.tokenType ?? current.tokenType,
          });
          writeSession(nextSession);
          return nextSession;
        } catch {
          writeSession(null);
          return null;
        } finally {
          this.refreshPromise = null;
        }
      })();
    }

    return this.refreshPromise;
  }

  async login(email: string, password: string) {
    const payload = await this.request<AuthResponse>("POST", "/auth/login", { email, password }, true);
    const session = parseLoginPayload(payload);
    writeSession(session);
    return session;
  }

  async logout() {
    const session = readSession();

    if (session?.refreshToken) {
      try {
        await this.request<void>("POST", "/auth/logout", { refreshToken: session.refreshToken }, true);
      } catch {
        // Swallow logout failures and clear local session regardless.
      }
    }

    writeSession(null);
  }

  getStoredSession() {
    return readSession();
  }

  clearSession() {
    writeSession(null);
  }

  getEmployeeDashboard() {
    return this.request<EmployeeDashboard>("GET", "/dashboard/employee");
  }

  getOwnerDashboard() {
    return this.request<OwnerDashboard>("GET", "/dashboard/owner");
  }

  searchLeads(filter: LeadFilter) {
    return this.request<PageResponse<Lead>>("POST", "/leads/search", filter);
  }

  createLead(payload: LeadRequest) {
    return this.request<Lead>("POST", "/leads", payload);
  }

  updateLead(id: number, payload: LeadRequest) {
    return this.request<Lead>("PUT", `/leads/${id}`, payload);
  }

  updateLeadStage(id: number, payload: UpdateStageRequest) {
    return this.request<Lead>("PUT", `/leads/${id}/stage`, payload);
  }

  reassignLeads(payload: ReassignLeadRequest) {
    return this.request<Lead[]>("PUT", "/leads/reassign", payload);
  }

  getUserActivities() {
    return this.request<Activity[]>("GET", "/activities/user");
  }

  getLeadActivities(leadId: number) {
    return this.request<Activity[]>("GET", `/activities/lead/${leadId}`);
  }

  createActivity(payload: ActivityRequest) {
    return this.request<Activity>("POST", "/activities", payload);
  }

  getTodayFollowUps() {
    return this.request<FollowUp[]>("GET", "/followups/today");
  }

  getMissedFollowUps() {
    return this.request<FollowUp[]>("GET", "/followups/missed");
  }

  createFollowUp(payload: FollowUpRequest) {
    return this.request<FollowUp>("POST", "/followups", payload);
  }

  completeFollowUp(id: number) {
    return this.request<FollowUp>("PUT", `/followups/${id}/complete`);
  }

  getLeadTimeline(leadId: number) {
    return this.request<TimelineEvent[]>("GET", `/timeline/lead/${leadId}`);
  }

  getEmployeePerformanceReport() {
    return this.request<EmployeePerformanceReport[]>("GET", "/reports/employee-performance");
  }

  getLeadConversionReport() {
    return this.request<LeadConversionReport>("GET", "/reports/lead-conversion");
  }

  getFollowUpComplianceReport() {
    return this.request<FollowUpComplianceReport>("GET", "/reports/followup-compliance");
  }

  createEmployee(payload: CreateEmployeeRequest) {
    return this.request<UserProfile>("POST", "/users/employees", payload);
  }

  getEmployees() {
    return this.request<UserProfile[]>("GET", "/users/employees");
  }

  getUsers() {
    return this.request<UserProfile[]>("GET", "/users");
  }
}

export const apiClient = new ApiClient();
