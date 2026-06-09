import { reportApi } from '../api/reportApi'
import { useAuth } from '../auth/AuthContext'
import { AppLayout } from '../components/AppLayout'
import { useAsync } from '../hooks/useAsync'

export function ReportsPage() {
  const { user } = useAuth()
  const { data, loading, error } = useAsync(
    () => reportApi.getEmployeePerformance(user!),
    [user],
  )

  return (
    <AppLayout
      title="Reports & Analytics"
      subtitle="Owner-facing insights for employee performance, conversion, and follow-up compliance."
    >
      {loading ? <div className="panel">Loading reports...</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      {data ? (
        <div className="stack-list">
          {data.map((item) => (
            <div key={item.employeeId} className="panel">
              <h3>Employee #{item.employeeId}</h3>
              <p>Leads handled: {item.leadsHandled}</p>
              <p>Activities count: {item.activitiesCount}</p>
              <p>Conversion rate: {item.conversionRate.toFixed(1)}%</p>
            </div>
          ))}
        </div>
      ) : null}
    </AppLayout>
  )
}
