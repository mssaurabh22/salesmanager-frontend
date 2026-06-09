import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
    >
      {label}
    </NavLink>
  );
}

export function AppLayout() {
  const { session, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  return (
    <div className="app-shell">
      <header className="mobile-topbar">
        <button
          type="button"
          className="menu-button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
        <div>
          <strong>SalesManager CRM</strong>
          <span>{session?.role}</span>
        </div>
      </header>

      {isMenuOpen ? <button type="button" className="sidebar-backdrop" aria-label="Close menu" onClick={closeMenu} /> : null}

      <aside className={isMenuOpen ? "sidebar open" : "sidebar"}>
        <div>
          <p className="eyebrow">SalesManager CRM</p>
          <h1>Field Sales Console</h1>
          <p className="muted">
            Signed in as {session?.email}
            <br />
            Role: {session?.role}
          </p>
        </div>

        <nav className="nav-list">
          <NavItem
            to={session?.role === "ADMIN" ? "/dashboard/owner" : "/dashboard/employee"}
            label="Dashboard"
            onClick={closeMenu}
          />
          <NavItem to="/leads" label="Leads" onClick={closeMenu} />
          <NavItem to="/activities" label="Activities" onClick={closeMenu} />
          <NavItem to="/followups" label="Follow-Ups" onClick={closeMenu} />
          <NavItem to="/timeline" label="Timeline" onClick={closeMenu} />
          {session?.role === "ADMIN" ? <NavItem to="/reports" label="Reports" onClick={closeMenu} /> : null}
          {session?.role === "ADMIN" ? <NavItem to="/admin/employees" label="Employees" onClick={closeMenu} /> : null}
          {session?.role === "ADMIN" ? <NavItem to="/admin/reassign" label="Reassign" onClick={closeMenu} /> : null}
        </nav>

        <button type="button" className="secondary-button" onClick={() => void handleLogout()}>
          Log out
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
