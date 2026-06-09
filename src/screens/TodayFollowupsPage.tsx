import { followupApi } from '../api/followupApi'
import { useAuth } from '../auth/AuthContext'
import { AppLayout } from '../components/AppLayout'
import { StatusPill } from '../components/StatusPill'
import { useAsync } from '../hooks/useAsync'

export function TodayFollowupsPage() {
  const { user } = useAuth()
  const { data, loading, error } = useAsync(() => followupApi.getToday(user!), [user])

  return (
    <AppLayout
      title="Today's Follow-ups"
      subtitle="Daily cockpit for scheduled calls, meetings, and promised callbacks."
    >
      {loading ? <div className="panel">Loading follow-ups...</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      {data ? (
        <div className="stack-list">
          {data.map((item) => (
            <div key={item.id} className="panel">
              <div className="row-between">
                <strong>Lead #{item.leadId}</strong>
                <StatusPill label={item.status} tone="success" />
              </div>
              <p>Follow-up time: {item.followUpTime}</p>
            </div>
          ))}
        </div>
      ) : null}
    </AppLayout>
  )
}
