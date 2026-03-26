import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  LineChart,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  Hexagon,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Empresas', path: '/', icon: Building2 },
  { name: 'Estatísticas', path: '/estatisticas', icon: BarChart3 },
  { name: 'Analytics', path: '/analytics', icon: LineChart },
  { name: 'Pagamentos', path: '/pagamentos', icon: CreditCard, badge: '3' },
]

const supportItems = [
  { name: 'Ajuda', path: '/ajuda', icon: HelpCircle },
  { name: 'Configurações', path: '/configuracoes', icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false
    return location.pathname.startsWith(path)
  }

  return (
    <Sidebar className="border-r-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <SidebarHeader className="p-6 pb-2">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hexagon className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">Finova</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </div>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  className="rounded-xl h-11 transition-all duration-200"
                >
                  <Link to={item.path} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-medium text-red-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <div className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Suporte
          </div>
          <SidebarMenu>
            {supportItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  className="rounded-xl h-11"
                >
                  <Link to={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 pt-0 space-y-6">
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-soft border">
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-yellow-400/20 blur-2xl" />
          <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-blue-400/20 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-md">
              <Hexagon className="h-5 w-5 fill-current" />
            </div>
            <p className="mb-4 text-sm font-semibold leading-snug text-foreground">
              Construa o futuro com passos financeiros inteligentes hoje.
            </p>
            <Button className="w-full rounded-xl" size="sm">
              Começar Agora
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-semibold">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
