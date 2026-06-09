import { useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { TimelineEvent } from "../../core/api/types";
import { LeadSelect } from "../../core/ui/LeadSelect";
import { EmptyState, ErrorBanner, Panel } from "../../core/ui/Ui";

export function TimelinePage() {
  const [leadId, setLeadId] = useState("");
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setEvents(await apiClient.getLeadTimeline(Number(leadId)));
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load timeline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell narrow">
      <Panel
        title="Lead timeline"
        description="Timeline events include creation, activities, follow-ups, stage changes, and reassignments."
        actions={
          <div className="inline-form">
            <LeadSelect
              value={Number(leadId)}
              onChange={(selectedLeadId) => setLeadId(String(selectedLeadId))}
              label="Lead"
            />
            <button type="button" className="primary-button" onClick={() => void load()} disabled={!leadId}>
              Load timeline
            </button>
          </div>
        }
      >
        {error ? <ErrorBanner message={error} retry={() => void load()} /> : null}
        {loading ? <p>Loading timeline...</p> : null}
        {!loading && !events.length ? <EmptyState message="Search for a lead to see its journey." /> : null}
        {events.length ? (
          <ul className="timeline-list">
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.action}</strong>
                <span>{event.description}</span>
                <span>User #{event.userId}</span>
                <time>{new Date(event.timestamp).toLocaleString()}</time>
              </li>
            ))}
          </ul>
        ) : null}
      </Panel>
    </div>
  );
}
