import { followupApi } from '../api/followupApi'
import { useAuth } from '../auth/AuthContext'
import { AppLayout } from '../components/AppLayout'
import { StatusPill } from '../components/StatusPill'
import { useAsync } from '../hooks/useAsync'

export function MissedFollowupsPage() {
  const { user } = useAuth()
  const { data, loading, error } = useAsync(() => followupApi.getMissed(user!), [user])

  return (
    <AppLayout
      title="Missed Follow-ups"
      subtitle="Risk-focused recovery list for follow-ups that were not completed on time."
    >
      {loading ? <div className="panel">Loading missed follow-ups...</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      {data ? (
        <div className="stack-list">
          {data.map((item) => (
            <div key={item.id} className="panel">
              <div className="row-between">
                <strong>Lead #{item.leadId}</strong>
                <StatusPill label={item.status} tone="danger" />
              </div>
              <p>Scheduled time: {item.followUpTime}</p>
            </div>
          ))}
        </div>
      ) : null}
    </AppLayout>
  )
}
