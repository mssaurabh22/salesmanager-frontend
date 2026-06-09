import { useEffect, useState } from "react";
import { apiClient, ApiError } from "../../core/api/apiClient";
import type { CreateEmployeeRequest, UserProfile } from "../../core/api/types";
import { EmptyState, ErrorBanner, Panel } from "../../core/ui/Ui";

const defaultForm: CreateEmployeeRequest = {
  name: "",
  email: "",
  phone: "",
  employeeCode: "",
  department: "Sales",
  designation: "Sales Executive",
  role: "EMPLOYEE",
  active: true,
  password: "",
};

export function UserManagementPage() {
  const [form, setForm] = useState<CreateEmployeeRequest>(defaultForm);
  const [employees, setEmployees] = useState<UserProfile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      setEmployees(await apiClient.getEmployees());
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await apiClient.createEmployee(form);
      setForm(defaultForm);
      await loadEmployees();
    } catch (caughtError) {
      setError(caughtError instanceof ApiError ? caughtError.message : "Unable to create employee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-shell two-column">
      <div className="page-column">
        <Panel title="Create employee profile" description="Admin-only user setup for field sales teams.">
          <form className="form-grid" onSubmit={submit}>
            <label>
              Full name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                required
              />
            </label>
            <label>
              Employee code
              <input
                value={form.employeeCode ?? ""}
                onChange={(event) => setForm({ ...form, employeeCode: event.target.value })}
              />
            </label>
            <label>
              Department
              <input
                value={form.department ?? ""}
                onChange={(event) => setForm({ ...form, department: event.target.value })}
              />
            </label>
            <label>
              Designation
              <input
                value={form.designation ?? ""}
                onChange={(event) => setForm({ ...form, designation: event.target.value })}
              />
            </label>
            <label>
              Role
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as "ADMIN" | "EMPLOYEE" })}>
                <option value="EMPLOYEE">Employee</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <label>
              Password
              <input
                type="password"
                minLength={6}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />
              Active profile
            </label>
            {error ? <ErrorBanner message={error} /> : null}
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? "Creating..." : "Create employee"}
            </button>
          </form>
        </Panel>
      </div>

      <div className="page-column">
        <Panel title="Active employees" description="Employees available for lead assignment.">
          {loading ? <p>Loading employees...</p> : null}
          {!loading && !employees.length ? <EmptyState message="No employees found." /> : null}
          {employees.length ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>{employee.department || "-"}</td>
                      <td>{employee.designation || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Panel>
      </div>
    </div>
  );
}
