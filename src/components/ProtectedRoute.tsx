import { Navigate, Outlet, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { usePermissions } from '@/hooks/use-permissions'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

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

  if (path.startsWith('/configuracoes') && role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  if (path.startsWith('/analytics') && role !== 'admin' && role !== 'gerente') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Acesso Negado</h1>
        <p className="text-slate-600 mb-6 text-center max-w-md">
          Você não tem permissão para acessar esta página. Contate o administrador.
        </p>
        <Button asChild>
          <Link to="/">Voltar ao Dashboard</Link>
        </Button>
      </div>
    )
  }

  if (role === 'gerente') {
    if (!path.startsWith('/dashboard') && !path.startsWith('/analytics')) {
      return <Navigate to="/dashboard" replace />
    }
  } else if (role === 'contador') {
    if (path.startsWith('/dashboard')) {
      return <Navigate to="/" replace />
    }
  } else if (role === 'consultor') {
    if (path.startsWith('/dashboard')) {
      return <Navigate to="/" replace />
    }
  }

  return <Outlet />
}
