import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { EmployeeDashboard } from "../../core/api/types";
import { ErrorBanner, Panel, StatCard } from "../../core/ui/Ui";

export function EmployeeDashboardPage() {
  const [data, setData] = useState<EmployeeDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiClient.getEmployeeDashboard());
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Employee dashboard</p>
          <h1>Today’s sales work</h1>
        </div>
      </header>

      {error ? <ErrorBanner message={error} retry={() => void load()} /> : null}

      <div className="stats-grid">
        <StatCard label="Today's follow-ups" value={loading ? "..." : data?.todayFollowUps ?? 0} />
        <StatCard label="Missed follow-ups" value={loading ? "..." : data?.missedFollowUps ?? 0} tone="warm" />
        <StatCard label="Assigned leads" value={loading ? "..." : data?.totalLeads ?? 0} />
        <StatCard label="Activities today" value={loading ? "..." : data?.activitiesToday ?? 0} tone="cool" />
      </div>

      <Panel
        title="How to use this view"
        description="This summary comes from the live dashboard API and helps employees focus on immediate work."
      >
        <ul className="plain-list">
          <li>Use Leads to create or update customer opportunities.</li>
          <li>Use Activities after calls, meetings, or WhatsApp follow-ups.</li>
          <li>Use Follow-Ups to complete today’s promised actions.</li>
        </ul>
      </Panel>
    </div>
  );
}
