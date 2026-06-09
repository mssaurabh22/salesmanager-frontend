import { useParams } from 'react-router-dom'
import { timelineApi } from '../api/timelineApi'
import { useAuth } from '../auth/AuthContext'
import { AppLayout } from '../components/AppLayout'
import { useAsync } from '../hooks/useAsync'

export function TimelinePage() {
  const { user } = useAuth()
  const params = useParams()
  const leadId = Number(params.leadId || 1)
  const { data, loading, error } = useAsync(
    () => timelineApi.getByLead(user!, leadId),
    [user, leadId],
  )

  return (
    <AppLayout
      title={`Lead #${leadId} Timeline`}
      subtitle="Customer journey and audit trail in reverse chronological order."
    >
      {loading ? <div className="panel">Loading timeline...</div> : null}
      {error ? <div className="error-banner">{error}</div> : null}
      {data ? (
        <div className="stack-list">
          {data.map((event) => (
            <div key={event.id} className="panel">
              <div className="row-between">
                <strong>{event.action}</strong>
                <span className="muted-text">{new Date(event.timestamp).toLocaleString()}</span>
              </div>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      ) : null}
    </AppLayout>
  )
}
