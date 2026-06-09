import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { Lead } from "../../core/api/types";
import { EmployeeSelect } from "../../core/ui/EmployeeSelect";
import { leadDisplayName } from "../../core/ui/LeadSelect";
import { ErrorBanner, EmptyState, Panel } from "../../core/ui/Ui";

export function ReassignLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);
  const [assignedTo, setAssignedTo] = useState(0);
  const [results, setResults] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.searchLeads({
          page: 0,
          size: 100,
          sortBy: "customerName",
          sortDirection: "ASC",
        });
        setLeads(response.content);
      } catch (caughtError) {
        setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load leads.");
      } finally {
        setLoading(false);
      }
    };

    void loadLeads();
  }, []);

  const toggleLead = (leadId: number) => {
    setSelectedLeadIds((current) =>
      current.includes(leadId) ? current.filter((id) => id !== leadId) : [...current, leadId],
    );
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = await apiClient.reassignLeads({
        leadIds: selectedLeadIds,
        assignedTo,
      });
      setResults(data);
      setSelectedLeadIds([]);
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to reassign leads.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell narrow">
      <Panel title="Reassign leads" description="Admin-only bulk reassignment integrated with the lead module.">
        <form className="form-grid" onSubmit={submit}>
          <EmployeeSelect value={assignedTo} onChange={setAssignedTo} />
          <div className="lead-picker">
            {loading ? <p>Loading leads...</p> : null}
            {!loading && !leads.length ? <EmptyState message="No leads available for reassignment." /> : null}
            {leads.map((lead) => (
              <label key={lead.id} className="checkbox-row lead-option">
                <input
                  type="checkbox"
                  checked={selectedLeadIds.includes(lead.id)}
                  onChange={() => toggleLead(lead.id)}
                />
                <span>{leadDisplayName(lead)}</span>
              </label>
            ))}
          </div>
          {error ? <ErrorBanner message={error} /> : null}
          <button type="submit" className="primary-button" disabled={saving || !assignedTo || !selectedLeadIds.length}>
            {saving ? "Reassigning..." : "Reassign leads"}
          </button>
        </form>

        {!results.length ? (
          <EmptyState message="Reassigned leads will appear here after a successful request." />
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Lead ID</th>
                  <th>Customer</th>
                  <th>Stage</th>
                  <th>Temperature</th>
                </tr>
              </thead>
              <tbody>
                {results.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.id}</td>
                    <td>{lead.customerName}</td>
                    <td>{lead.stage}</td>
                    <td>{lead.temperature}</td>
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
