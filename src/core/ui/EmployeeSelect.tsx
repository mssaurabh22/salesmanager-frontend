import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../api/apiClient";
import type { UserProfile } from "../api/types";

export function employeeDisplayName(employee?: UserProfile | null) {
  if (!employee) {
    return "Unknown employee";
  }

  const suffix = [employee.designation, employee.department].filter(Boolean).join(", ");
  return `${employee.name}${suffix ? ` - ${suffix}` : ""} (#${employee.id})`;
}

export function EmployeeSelect({
  value,
  onChange,
  required = true,
}: {
  value: number;
  onChange: (employeeId: number) => void;
  required?: boolean;
}) {
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setEmployees(await apiClient.getEmployees());
      } catch (caughtError) {
        setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load employees.");
      }
    };

    void loadEmployees();
  }, []);

  return (
    <label>
      Assign to employee
      <select
        value={value || ""}
        onChange={(event) => onChange(Number(event.target.value))}
        required={required}
      >
        <option value="">Select employee</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employeeDisplayName(employee)}
          </option>
        ))}
      </select>
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
}
