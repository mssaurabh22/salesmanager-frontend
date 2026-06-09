import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { Lead, LeadFilter, LeadRequest, LeadStage, PageResponse } from "../../core/api/types";
import { ErrorBanner, Panel, EmptyState } from "../../core/ui/Ui";

const defaultLeadForm: LeadRequest = {
  customerName: "",
  businessName: "",
  contactNumber: "",
  email: "",
  expectedValue: 0,
};

const defaultFilter: LeadFilter = {
  page: 0,
  size: 10,
  search: "",
  sortBy: "createdAt",
  sortDirection: "DESC",
};

const stageOptions: LeadStage[] = ["SUSPECT", "APPROACH", "NEGOTIATION", "CLOSURE", "ORDER", "LOST"];

function stageLabel(stage: LeadStage) {
  return stage === "SUSPECT" ? "SUSPECT / PROSPECT" : stage;
}

export function LeadManagementPage() {
  const [form, setForm] = useState<LeadRequest>(defaultLeadForm);
  const [filter, setFilter] = useState<LeadFilter>(defaultFilter);
  const [result, setResult] = useState<PageResponse<Lead> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stageLeadId, setStageLeadId] = useState<number | null>(null);

  const loadLeads = async (nextFilter: LeadFilter = filter) => {
    setSearching(true);
    setError(null);
    try {
      setResult(await apiClient.searchLeads(nextFilter));
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load leads.");
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    void loadLeads(defaultFilter);
  }, []);

  const handleCreateLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await apiClient.createLead(form);
      setForm(defaultLeadForm);
      await loadLeads();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to create lead.");
    } finally {
      setSaving(false);
    }
  };

  const handleStageChange = async (leadId: number, stage: LeadStage) => {
    setStageLeadId(leadId);
    setError(null);
    try {
      await apiClient.updateLeadStage(leadId, { stage });
      await loadLeads();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to update stage.");
    } finally {
      setStageLeadId(null);
    }
  };

  return (
    <div className="page-shell two-column">
      <div className="page-column">
        <Panel title="Create lead" description="Uses the live lead creation API with backend validation.">
          <form className="form-grid" onSubmit={handleCreateLead}>
            <label>
              Customer name
              <input
                value={form.customerName}
                onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                required
              />
            </label>
            <label>
              Business name
              <input
                value={form.businessName ?? ""}
                onChange={(event) => setForm({ ...form, businessName: event.target.value })}
              />
            </label>
            <label>
              Contact number
              <input
                value={form.contactNumber}
                onChange={(event) => setForm({ ...form, contactNumber: event.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </label>
            <label>
              Expected value
              <input
                type="number"
                min="0"
                value={form.expectedValue ?? 0}
                onChange={(event) => setForm({ ...form, expectedValue: Number(event.target.value) })}
              />
            </label>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Saving..." : "Create lead"}
            </button>
          </form>
        </Panel>
      </div>

      <div className="page-column">
        <Panel
          title="Lead pipeline"
          description="Employees only see assigned leads because the backend scopes the search for them."
          actions={
            <form
              className="inline-form"
              onSubmit={(event) => {
                event.preventDefault();
                void loadLeads(filter);
              }}
            >
              <input
                placeholder="Search by customer, business, or phone"
                value={filter.search ?? ""}
                onChange={(event) => setFilter({ ...filter, search: event.target.value, page: 0 })}
              />
              <button type="submit" className="secondary-button">
                Search
              </button>
            </form>
          }
        >
          {error ? <ErrorBanner message={error} retry={() => void loadLeads()} /> : null}
          {searching ? <p>Loading leads...</p> : null}
          {!searching && !result?.content.length ? <EmptyState message="No leads found for this filter." /> : null}
          {result?.content.length ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Business</th>
                    <th>Stage</th>
                    <th>Temperature</th>
                    <th>Weightage</th>
                    <th>Expected value</th>
                  </tr>
                </thead>
                <tbody>
                  {result.content.map((lead) => (
                    <tr key={lead.id}>
                      <td>{lead.id}</td>
                      <td>{lead.customerName}</td>
                      <td>{lead.businessName || "-"}</td>
                      <td>
                        <select
                          value={lead.stage}
                          disabled={stageLeadId === lead.id}
                          onChange={(event) => void handleStageChange(lead.id, event.target.value as LeadStage)}
                        >
                          {stageOptions.map((stage) => (
                            <option key={stage} value={stage}>
                              {stageLabel(stage)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{lead.temperature}</td>
                      <td>{lead.weightage}%</td>
                      <td>{lead.expectedValue ? `₹${lead.expectedValue.toLocaleString()}` : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          {result ? (
            <div className="table-footer">
              <span>
                Page {result.number + 1} of {result.totalPages || 1}
              </span>
              <div className="inline-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    const next = { ...filter, page: Math.max(0, filter.page - 1) };
                    setFilter(next);
                    void loadLeads(next);
                  }}
                  disabled={result.first}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    const next = { ...filter, page: filter.page + 1 };
                    setFilter(next);
                    void loadLeads(next);
                  }}
                  disabled={result.last}
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
