import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function AppLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: ReactNode
}) {
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const navItems = isAdmin
    ? [
        { to: '/owner', label: 'Dashboard' },
        { to: '/reassign', label: 'Reassign' },
        { to: '/reports', label: 'Reports' },
        { to: '/timeline/1', label: 'Timeline' },
      ]
    : [
        { to: '/employee', label: 'Dashboard' },
        { to: '/lead/new', label: 'New Lead' },
        { to: '/activity/new', label: 'Log Activity' },
        { to: '/followups/today', label: 'Today' },
        { to: '/followups/missed', label: 'Missed' },
        { to: '/timeline/1', label: 'Timeline' },
      ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">SM</div>
          <div>
            <h1>Sales Manager</h1>
            <p>{isAdmin ? 'Owner Console' : 'Employee Workspace'}</p>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <strong>{user?.email}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="secondary-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        </header>
        <section>{children}</section>
      </main>
    </div>
  )
}
