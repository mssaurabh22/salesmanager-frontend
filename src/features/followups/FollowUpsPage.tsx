import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { FollowUp, FollowUpRequest } from "../../core/api/types";
import { LeadSelect, useLeadLookup } from "../../core/ui/LeadSelect";
import { EmptyState, ErrorBanner, Panel } from "../../core/ui/Ui";

const defaultForm: FollowUpRequest = {
  leadId: 0,
  followUpTime: "",
};

export function FollowUpsPage() {
  const [form, setForm] = useState<FollowUpRequest>(defaultForm);
  const [today, setToday] = useState<FollowUp[]>([]);
  const [missed, setMissed] = useState<FollowUp[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completingId, setCompletingId] = useState<number | null>(null);
  const { nameForLead } = useLeadLookup();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayData, missedData] = await Promise.all([
        apiClient.getTodayFollowUps(),
        apiClient.getMissedFollowUps(),
      ]);
      setToday(todayData);
      setMissed(missedData);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load follow-ups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiClient.createFollowUp(form);
      setForm(defaultForm);
      await load();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to create follow-up.");
    } finally {
      setSaving(false);
    }
  };

  const complete = async (id: number) => {
    setCompletingId(id);
    setError(null);
    try {
      await apiClient.completeFollowUp(id);
      await load();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to complete follow-up.");
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="page-shell two-column">
      <div className="page-column">
        <Panel title="Schedule follow-up" description="Creates a pending follow-up for the authenticated user.">
          <form className="form-grid" onSubmit={submit}>
            <LeadSelect value={form.leadId} onChange={(leadId) => setForm({ ...form, leadId })} />
            <label>
              Follow-up time
              <input
                type="datetime-local"
                value={form.followUpTime}
                onChange={(event) => setForm({ ...form, followUpTime: event.target.value })}
                required
              />
            </label>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Create follow-up"}
            </button>
          </form>
        </Panel>

        <Panel title="Missed follow-ups" description="Pulled from the follow-up intelligence workflow.">
          {loading ? <p>Loading missed follow-ups...</p> : null}
          {!loading && !missed.length ? <EmptyState message="No missed follow-ups right now." /> : null}
          {missed.length ? (
            <ul className="timeline-list">
              {missed.map((item) => (
                <li key={item.id}>
                  <strong>{nameForLead(item.leadId)}</strong>
                  <span>Status: {item.status}</span>
                  <time>{new Date(item.followUpTime).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      </div>

      <div className="page-column">
        <Panel title="Today's follow-ups" description="Complete actions directly from the live API.">
          {error ? <ErrorBanner message={error} retry={() => void load()} /> : null}
          {loading ? <p>Loading today's work...</p> : null}
          {!loading && !today.length ? <EmptyState message="No follow-ups scheduled for today." /> : null}
          {today.length ? (
            <ul className="timeline-list">
              {today.map((item) => (
                <li key={item.id}>
                  <strong>{nameForLead(item.leadId)}</strong>
                  <span>Status: {item.status}</span>
                  <time>{new Date(item.followUpTime).toLocaleString()}</time>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => void complete(item.id)}
                    disabled={completingId === item.id}
                  >
                    {completingId === item.id ? "Completing..." : "Mark completed"}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
