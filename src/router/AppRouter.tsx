import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../auth/AuthContext'
import { LoginPage } from '../screens/LoginPage'
import { EmployeeDashboardPage } from '../screens/EmployeeDashboardPage'
import { OwnerDashboardPage } from '../screens/OwnerDashboardPage'
import { LeadCreatePage } from '../screens/LeadCreatePage'
import { ActivityCreatePage } from '../screens/ActivityCreatePage'
import { TodayFollowupsPage } from '../screens/TodayFollowupsPage'
import { MissedFollowupsPage } from '../screens/MissedFollowupsPage'
import { TimelinePage } from '../screens/TimelinePage'
import { ReassignPage } from '../screens/ReassignPage'
import { ReportsPage } from '../screens/ReportsPage'

export function AppRouter() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/owner' : '/employee'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/employee"
        element={
          <ProtectedRoute>
            <EmployeeDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner"
        element={
          <ProtectedRoute role="ADMIN">
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lead/new"
        element={
          <ProtectedRoute>
            <LeadCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity/new"
        element={
          <ProtectedRoute>
            <ActivityCreatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/followups/today"
        element={
          <ProtectedRoute>
            <TodayFollowupsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/followups/missed"
        element={
          <ProtectedRoute>
            <MissedFollowupsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timeline/:leadId"
        element={
          <ProtectedRoute>
            <TimelinePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reassign"
        element={
          <ProtectedRoute role="ADMIN">
            <ReassignPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute role="ADMIN">
            <ReportsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
