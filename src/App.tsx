import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SearchProvider } from '@/context/SearchContext'

import Layout from './components/Layout'
import Index from './pages/Index'
import Dashboard from './pages/Dashboard'
import Estatisticas from './pages/Estatisticas'
import Analytics from './pages/Analytics'
import Pagamentos from './pages/Pagamentos'
import Ajuda from './pages/Ajuda'
import Configuracoes from './pages/Configuracoes'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <SearchProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/pagamentos" element={<Pagamentos />} />
            <Route path="/ajuda" element={<Ajuda />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </SearchProvider>
  </BrowserRouter>
)

export default App
