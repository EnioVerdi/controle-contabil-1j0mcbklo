import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { usePermissions } from '@/hooks/use-permissions'

export function ProtectedRoute() {
  const { user, loading: authLoading } = useAuth()
  const { role, loading: permLoading } = usePermissions()
  const location = useLocation()

  if (authLoading || permLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const path = location.pathname

  if (role === 'gerente') {
    if (!path.startsWith('/dashboard') && !path.startsWith('/analytics')) {
      return <Navigate to="/dashboard" replace />
    }
  } else if (role === 'contador') {
    if (path.startsWith('/dashboard') || path.startsWith('/configuracoes')) {
      return <Navigate to="/" replace />
    }
  } else if (role === 'consultor') {
    if (path.startsWith('/dashboard') || path.startsWith('/configuracoes')) {
      return <Navigate to="/" replace />
    }
  }

  return <Outlet />
}
