import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import type { Role } from "../api/types";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { session, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="screen-center">
        <div className="panel">
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(session.role)) {
    return <Navigate to={session.role === "ADMIN" ? "/dashboard/owner" : "/dashboard/employee"} replace />;
  }

  return <>{children}</>;
}
