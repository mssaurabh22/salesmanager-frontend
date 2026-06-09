import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type {
  EmployeePerformanceReport,
  FollowUpComplianceReport,
  LeadConversionReport,
} from "../../core/api/types";
import { EmptyState, ErrorBanner, Panel, StatCard } from "../../core/ui/Ui";

export function ReportsPage() {
  const [employeePerformance, setEmployeePerformance] = useState<EmployeePerformanceReport[]>([]);
  const [leadConversion, setLeadConversion] = useState<LeadConversionReport | null>(null);
  const [followUpCompliance, setFollowUpCompliance] = useState<FollowUpComplianceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [employeeData, leadData, followUpData] = await Promise.all([
        apiClient.getEmployeePerformanceReport(),
        apiClient.getLeadConversionReport(),
        apiClient.getFollowUpComplianceReport(),
      ]);
      setEmployeePerformance(employeeData);
      setLeadConversion(leadData);
      setFollowUpCompliance(followUpData);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load reports.");
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
          <p className="eyebrow">Reports</p>
          <h1>Analytics and performance tracking</h1>
        </div>
      </header>

      {error ? <ErrorBanner message={error} retry={() => void load()} /> : null}

      <div className="stats-grid">
        <StatCard label="Total leads" value={loading ? "..." : leadConversion?.totalLeads ?? 0} />
        <StatCard label="Closed leads" value={loading ? "..." : leadConversion?.closedLeads ?? 0} tone="hot" />
        <StatCard label="Lost leads" value={loading ? "..." : leadConversion?.lostLeads ?? 0} tone="warm" />
        <StatCard
          label="Conversion rate"
          value={loading ? "..." : `${(leadConversion?.conversionRate ?? 0).toFixed(1)}%`}
        />
        <StatCard
          label="Follow-up compliance"
          value={loading ? "..." : `${(followUpCompliance?.complianceRate ?? 0).toFixed(1)}%`}
          tone="cool"
        />
      </div>

      <Panel title="Employee performance" description="Aggregated reporting data from the report module.">
        {!loading && !employeePerformance.length ? (
          <EmptyState message="No employee performance records available yet." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Leads handled</th>
                  <th>Activities</th>
                  <th>Conversion rate</th>
                </tr>
              </thead>
              <tbody>
                {employeePerformance.map((row) => (
                  <tr key={row.employeeId}>
                    <td>{row.employeeId}</td>
                    <td>{row.leadsHandled}</td>
                    <td>{row.activitiesCount}</td>
                    <td>{row.conversionRate.toFixed(1)}%</td>
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
