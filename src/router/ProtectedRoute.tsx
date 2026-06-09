import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function ProtectedRoute({
  children,
  role,
}: {
  children: JSX.Element
  role?: 'ADMIN' | 'EMPLOYEE'
}) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/owner' : '/employee'} replace />
  }

  return children
}
