import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { user, login, loading } = useAuth()
  const [email, setEmail] = useState('employee@crm.com')
  const [password, setPassword] = useState('employee123')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return <Navigate to={user.role === 'ADMIN' ? '/owner' : '/employee'} replace />
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="hero-block">
          <span className="eyebrow">Sales Tracking CRM</span>
          <h1>React workspace for employee and owner operations</h1>
          <p>
            This app talks to the Spring Boot backend directly using the real JWT login flow and protected APIs.
          </p>
        </div>

        <form className="form-panel" onSubmit={onSubmit}>
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error ? <div className="error-banner">{error}</div> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <small>
            Seeded credentials from the backend initializer:
            <br />
            `admin@crm.com / admin123`
            <br />
            `employee@crm.com / employee123`
          </small>
        </form>
      </div>
    </div>
  )
}
