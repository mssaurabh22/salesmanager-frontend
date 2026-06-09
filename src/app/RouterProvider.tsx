import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../core/auth/AuthProvider";
import { AppLayout } from "../core/layout/AppLayout";
import { ProtectedRoute } from "../core/routing/ProtectedRoute";
import { LoginPage } from "../features/auth/LoginPage";
import { EmployeeDashboardPage } from "../features/dashboard/EmployeeDashboardPage";
import { OwnerDashboardPage } from "../features/dashboard/OwnerDashboardPage";
import { LeadManagementPage } from "../features/leads/LeadManagementPage";
import { ActivityPage } from "../features/activities/ActivityPage";
import { FollowUpsPage } from "../features/followups/FollowUpsPage";
import { TimelinePage } from "../features/timeline/TimelinePage";
import { ReportsPage } from "../features/reports/ReportsPage";
import { ReassignLeadsPage } from "../features/admin/ReassignLeadsPage";
import { UserManagementPage } from "../features/admin/UserManagementPage";

function HomeRedirect() {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return session.role === "ADMIN" ? (
    <Navigate to="/dashboard/owner" replace />
  ) : (
    <Navigate to="/dashboard/employee" replace />
  );
}

function NotFoundPage() {
  return (
    <div className="page-shell narrow">
      <section className="panel">
        <h1>Page not found</h1>
        <p>The page you requested does not exist.</p>
      </section>
    </div>
  );
}

export function RouterProvider() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeRedirect />} />
        <Route path="dashboard/employee" element={<EmployeeDashboardPage />} />
        <Route
          path="dashboard/owner"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <OwnerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="leads" element={<LeadManagementPage />} />
        <Route path="activities" element={<ActivityPage />} />
        <Route path="followups" element={<FollowUpsPage />} />
        <Route path="timeline" element={<TimelinePage />} />
        <Route
          path="reports"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/reassign"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <ReassignLeadsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/employees"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
