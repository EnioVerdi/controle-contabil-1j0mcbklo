import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Presentation,
  BarChart3,
  LineChart,
  HelpCircle,
  Settings,
  LogOut,
  Activity,
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
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import { useAuth } from '@/hooks/use-auth'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Empresas', path: '/', icon: Presentation },
  { name: 'Timeline', path: '/timeline', icon: BarChart3 },
  { name: 'Análises', path: '/analytics', icon: LineChart },
  { name: 'Configurações', path: '/configuracoes', icon: Settings },
]

const supportItems = [{ name: 'Ajuda', path: '/ajuda', icon: HelpCircle }]

export function AppSidebar() {
  const location = useLocation()
  const { role } = usePermissions()
  const { signOut } = useAuth()

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false
    return location.pathname.startsWith(path)
  }

  const visibleNavItems = navItems.filter((item) => {
    if (role === 'admin') return true
    if (item.path === '/configuracoes') return false

    const defaultTabs = ['/dashboard', '/timeline', '/analytics', '/']
    if (defaultTabs.includes(item.path)) return true

    if (role === 'contador' || role === 'consultor') {
      return defaultTabs.includes(item.path)
    }
    return false
  })

  const visibleSupportItems = supportItems.filter(() => true)

  return (
    <Sidebar className="border-r-0 bg-white">
      <SidebarHeader className="p-8 pb-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-900 text-white">
            <Activity className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">Finova</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <div className="mb-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Menu
          </div>
          <SidebarMenu className="gap-1.5">
            {visibleNavItems.map((item) => {
              const active = isActive(item.path)
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'rounded-2xl h-12 transition-all duration-200 px-4 group',
                      active
                        ? 'bg-[#14151A] text-white hover:bg-[#14151A]/90 hover:text-white'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                    )}
                  >
                    <Link to={item.path} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3.5">
                        <item.icon
                          className={cn(
                            'h-5 w-5',
                            active ? 'text-white' : 'text-gray-400 group-hover:text-gray-900',
                          )}
                        />
                        <span className="font-bold text-sm">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-8">
          <div className="mb-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Suporte
          </div>
          <SidebarMenu className="gap-1.5">
            {visibleSupportItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className="rounded-2xl h-12 px-4 text-gray-500 hover:bg-gray-50 hover:text-gray-900 group"
                >
                  <Link to={item.path} className="flex items-center gap-3.5">
                    <item.icon className="h-5 w-5 text-gray-400 group-hover:text-gray-900" />
                    <span className="font-bold text-sm">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 space-y-4 mb-4">
        {/* Promotional Card exactly matching the visual reference */}
        <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col justify-between min-h-[180px]">
          <div className="relative z-10 flex flex-col text-left items-start">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white shadow-md">
              <Activity className="h-5 w-5 fill-current" />
            </div>
            <p className="mb-5 text-[15px] pr-4 font-bold leading-snug text-gray-900 tracking-tight">
              Construa riqueza futura com passos financeiros inteligentes hoje.
            </p>
            <Button className="w-fit rounded-full bg-gray-900 hover:bg-black text-white px-6 h-9 text-xs font-bold shadow-lg shadow-gray-900/20">
              Começar Agora
            </Button>
          </div>
          {/* Decorative Money Bag Emoji to match visual style */}
          <div className="absolute -bottom-4 -right-4 text-7xl opacity-90 drop-shadow-2xl rotate-[-10deg] select-none pointer-events-none filter sepia-[0.2] hue-rotate-[90deg] saturate-[1.5]">
            💰
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={() => signOut()}
          className="w-full justify-start gap-3.5 rounded-2xl h-12 px-4 text-red-500 hover:text-red-600 hover:bg-red-50 group mt-2"
        >
          <LogOut className="h-5 w-5 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-sm">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
