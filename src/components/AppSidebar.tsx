import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Presentation,
  BarChart3,
  LineChart,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react'
import logoVerdi from '@/assets/image-c1f91.png'
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
        <div className="flex items-center justify-center px-2">
          <img src={logoVerdi} alt="Verdi Oelke" className="h-12 w-auto object-contain" />
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
