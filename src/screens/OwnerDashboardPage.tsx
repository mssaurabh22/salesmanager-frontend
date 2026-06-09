import { dashboardApi } from '../api/dashboardApi'
import { useAuth } from '../auth/AuthContext'
import { AppLayout } from '../components/AppLayout'
import { MetricCard } from '../components/MetricCard'
import { useAsync } from '../hooks/useAsync'
import { Link } from 'react-router-dom'

export function OwnerDashboardPage() {
  const { user } = useAuth()
  const { data, loading, error } = useAsync(
    () => dashboardApi.getOwnerDashboard(user!),
    [user],
  )

  return (
    <AppLayout
      title="Business Control Center"
      subtitle="Pipeline, forecasting, employee performance, and transfer operations."
    >
      {loading ? <div className="panel">Loading owner dashboard...</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      {data ? (
        <>
          <div className="metrics-grid two-up">
            <MetricCard label="Revenue Forecast" value={`₹ ${Math.round(data.revenueForecast)}`} accent="var(--accent)" />
            <MetricCard label="Total Leads" value={data.totalLeads} />
            <MetricCard label="Hot Leads" value={data.hotLeads} />
            <MetricCard label="Warm Leads" value={data.warmLeads} />
            <MetricCard label="Cold Leads" value={data.coldLeads} />
          </div>

          <div className="list-grid">
            <Link className="action-card" to="/reassign">
              <h3>Lead Reassignment</h3>
              <p>Transfer customers to another employee and preserve audit history.</p>
            </Link>
            <Link className="action-card" to="/reports">
              <h3>Reports & Analytics</h3>
              <p>Performance, conversion, and follow-up compliance views.</p>
            </Link>
            <Link className="action-card" to="/timeline/1">
              <h3>Lead Timeline</h3>
              <p>Inspect lead history before reassignment or stage intervention.</p>
            </Link>
          </div>

          <div className="panel">
            <h3>Employee Activity Today</h3>
            <div className="stack-list">
              {data.employeePerformance.map((item) => (
                <div key={item.employeeId} className="list-row">
                  <strong>Employee #{item.employeeId}</strong>
                  <span>{item.activitiesToday} activities</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </AppLayout>
  )
}
