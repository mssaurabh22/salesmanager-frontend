import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { OwnerDashboard } from "../../core/api/types";
import { EmptyState, ErrorBanner, Panel, StatCard } from "../../core/ui/Ui";

export function OwnerDashboardPage() {
  const [data, setData] = useState<OwnerDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await apiClient.getOwnerDashboard());
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load owner dashboard.");
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
          <p className="eyebrow">Owner dashboard</p>
          <h1>Business overview</h1>
        </div>
      </header>

      {error ? <ErrorBanner message={error} retry={() => void load()} /> : null}

      <div className="stats-grid">
        <StatCard label="Total leads" value={loading ? "..." : data?.totalLeads ?? 0} />
        <StatCard label="Hot leads" value={loading ? "..." : data?.hotLeads ?? 0} tone="hot" />
        <StatCard label="Warm leads" value={loading ? "..." : data?.warmLeads ?? 0} tone="warm" />
        <StatCard label="Cold leads" value={loading ? "..." : data?.coldLeads ?? 0} tone="cool" />
        <StatCard
          label="Revenue forecast"
          value={loading ? "..." : `₹${(data?.revenueForecast ?? 0).toLocaleString()}`}
        />
      </div>

      <Panel title="Employee activity snapshot" description="Aggregated from the dashboard module.">
        {!loading && !data?.employeePerformance.length ? (
          <EmptyState message="No employee activity has been recorded yet." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Activities today</th>
                </tr>
              </thead>
              <tbody>
                {(data?.employeePerformance ?? []).map((item) => (
                  <tr key={item.employeeId}>
                    <td>{item.employeeId}</td>
                    <td>{item.activitiesToday}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
