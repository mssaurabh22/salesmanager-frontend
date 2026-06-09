import { dashboardApi } from '../api/dashboardApi'
import { AppLayout } from '../components/AppLayout'
import { MetricCard } from '../components/MetricCard'
import { useAuth } from '../auth/AuthContext'
import { useAsync } from '../hooks/useAsync'
import { Link } from 'react-router-dom'

export function EmployeeDashboardPage() {
  const { user } = useAuth()
  const { data, loading, error } = useAsync(
    () => dashboardApi.getEmployeeDashboard(user!),
    [user],
  )

  return (
    <AppLayout
      title="Daily Cockpit"
      subtitle="Everything an employee needs for leads, meetings, notes, and follow-up discipline."
    >
      {loading ? <div className="panel">Loading dashboard...</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      {data ? (
        <>
          <div className="metrics-grid two-up">
            <MetricCard label="Today's Follow-ups" value={data.todayFollowUps} />
            <MetricCard label="Missed" value={data.missedFollowUps} accent="var(--danger)" />
            <MetricCard label="Total Leads" value={data.totalLeads} />
            <MetricCard
              label="Activities Today"
              value={data.activitiesToday}
              accent="var(--accent)"
            />
          </div>

          <div className="list-grid">
            <Link className="action-card" to="/lead/new">
              <h3>Add New Customer</h3>
              <p>Quick lead entry from a call or field visit.</p>
            </Link>
            <Link className="action-card" to="/activity/new">
              <h3>Log Meeting / Call / WhatsApp</h3>
              <p>Capture notes and engagement details in one place.</p>
            </Link>
            <Link className="action-card" to="/followups/today">
              <h3>Today's Follow-ups</h3>
              <p>Complete scheduled customer work for the day.</p>
            </Link>
            <Link className="action-card" to="/followups/missed">
              <h3>Missed Follow-ups</h3>
              <p>Recover risky commitments before they become leakage.</p>
            </Link>
            <Link className="action-card" to="/timeline/1">
              <h3>Lead Timeline</h3>
              <p>Review the full customer journey in reverse chronological order.</p>
            </Link>
          </div>
        </>
      ) : null}
    </AppLayout>
  )
}
