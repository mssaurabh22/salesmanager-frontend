import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../core/api/apiClient";
import { useAuth } from "../../core/auth/AuthProvider";

export function LoginPage() {
  const { session, login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@crm.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (session) {
    return <Navigate to={session.role === "ADMIN" ? "/dashboard/owner" : "/dashboard/employee"} replace />;
  }

  const redirectPath = (location.state as { from?: string } | null)?.from;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(redirectPath || "/");
    } catch (caughtError) {
      if (caughtError instanceof ApiError) {
        setError(caughtError.message);
      } else {
        setError("Unable to sign in right now.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">SalesManager CRM</p>
        <h1>Track leads, field work, and follow-up discipline in one place.</h1>
        <p>
          This React app is wired to the Spring Boot APIs already implemented in the backend.
          Use the seeded admin or employee credentials to get started.
        </p>
      </section>

      <section className="panel auth-card">
        <h2>Sign in</h2>
        <p className="muted">Admin: admin@crm.com / admin123</p>
        <p className="muted">Employee: employee@crm.com / employee123</p>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </label>
          {error ? <div className="error-banner">{error}</div> : null}
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </div>
  );
}
