import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../api/apiClient";
import type { Lead } from "../api/types";

export function leadDisplayName(lead?: Pick<Lead, "id" | "customerName" | "businessName"> | null) {
  if (!lead) {
    return "Unknown lead";
  }

  return `${lead.customerName}${lead.businessName ? ` - ${lead.businessName}` : ""} (#${lead.id})`;
}

export function LeadSelect({
  value,
  onChange,
  required = true,
  label = "Lead",
}: {
  value: number;
  onChange: (leadId: number) => void;
  required?: boolean;
  label?: string;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeads = async () => {
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
      }
    };

    void loadLeads();
  }, []);

  return (
    <label>
      {label}
      <select
        value={value || ""}
        onChange={(event) => onChange(Number(event.target.value))}
        required={required}
      >
        <option value="">Select lead</option>
        {leads.map((lead) => (
          <option key={lead.id} value={lead.id}>
            {leadDisplayName(lead)}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}

export function useLeadLookup() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const response = await apiClient.searchLeads({
          page: 0,
          size: 100,
          sortBy: "customerName",
          sortDirection: "ASC",
        });
        setLeads(response.content);
      } catch {
        setLeads([]);
      }
    };

    void loadLeads();
  }, []);

  return {
    leads,
    nameForLead: (leadId: number) => leadDisplayName(leads.find((lead) => lead.id === leadId)),
  };
}
