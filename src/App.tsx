import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SearchProvider } from '@/context/SearchContext'

import { AuthProvider } from './hooks/use-auth'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import Index from './pages/Index'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EmpresaDetails from './pages/EmpresaDetails'
import Timeline from './pages/Timeline'
import Analytics from './pages/Analytics'
import Pagamentos from './pages/Pagamentos'
import Usuarios from './pages/Usuarios'
import Ajuda from './pages/Ajuda'
import Configuracoes from './pages/Configuracoes'
import NotFound from './pages/NotFound'

const App = () => (
  <AuthProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <SearchProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/empresas/:id" element={<EmpresaDetails />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/pagamentos" element={<Pagamentos />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/ajuda" element={<Ajuda />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </SearchProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
