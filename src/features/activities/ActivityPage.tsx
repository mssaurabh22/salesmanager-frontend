import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { Activity, ActivityRequest, ActivityType } from "../../core/api/types";
import { LeadSelect, useLeadLookup } from "../../core/ui/LeadSelect";
import { EmptyState, ErrorBanner, Panel } from "../../core/ui/Ui";

const activityTypes: ActivityType[] = ["CALL", "MEETING", "WHATSAPP", "EMAIL", "NOTE"];

const defaultForm: ActivityRequest = {
  leadId: 0,
  type: "CALL",
  notes: "",
};

export function ActivityPage() {
  const [form, setForm] = useState<ActivityRequest>(defaultForm);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leadActivities, setLeadActivities] = useState<Activity[]>([]);
  const [leadIdLookup, setLeadIdLookup] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { nameForLead } = useLeadLookup();

  const loadUserActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      setActivities(await apiClient.getUserActivities());
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load activities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUserActivities();
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiClient.createActivity(form);
      setForm(defaultForm);
      await loadUserActivities();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to create activity.");
    } finally {
      setSaving(false);
    }
  };

  const loadLeadActivities = async () => {
    setError(null);
    try {
      setLeadActivities(await apiClient.getLeadActivities(Number(leadIdLookup)));
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load lead activities.");
    }
  };

  return (
    <div className="page-shell two-column">
      <div className="page-column">
        <Panel title="Log activity" description="Calls, meetings, WhatsApp, email, and notes all flow into the backend.">
          <form className="form-grid" onSubmit={submit}>
            <LeadSelect value={form.leadId} onChange={(leadId) => setForm({ ...form, leadId })} />
            <label>
              Activity type
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value as ActivityType })}
              >
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="full-span">
              Notes
              <textarea
                rows={4}
                value={form.notes ?? ""}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </label>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Create activity"}
            </button>
          </form>
        </Panel>

        <Panel
          title="Lead activity timeline"
          description="Look up activities for a specific lead."
          actions={
            <div className="inline-form">
              <LeadSelect
                value={Number(leadIdLookup)}
                onChange={(leadId) => setLeadIdLookup(String(leadId))}
                label="Lead"
              />
              <button type="button" className="secondary-button" onClick={() => void loadLeadActivities()}>
                Load
              </button>
            </div>
          }
        >
          {!leadActivities.length ? (
            <EmptyState message="Select a lead to inspect its activities." />
          ) : (
            <ul className="timeline-list">
              {leadActivities.map((item) => (
                <li key={item.id}>
                  <strong>{item.type}</strong>
                  <span>{item.notes || "No notes added."}</span>
                  <time>{new Date(item.createdAt).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="page-column">
        <Panel title="My recent activities" description="This list is populated by GET /api/activities/user.">
          {error ? <ErrorBanner message={error} retry={() => void loadUserActivities()} /> : null}
          {loading ? <p>Loading activities...</p> : null}
          {!loading && !activities.length ? <EmptyState message="No activities created yet." /> : null}
          {activities.length ? (
            <ul className="timeline-list">
              {activities.map((item) => (
                <li key={item.id}>
                  <strong>{item.type}</strong>
                  <span>{nameForLead(item.leadId)}</span>
                  <span>{item.notes || "No notes added."}</span>
                  <time>{new Date(item.createdAt).toLocaleString()}</time>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
