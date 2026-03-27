import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'
import { Building2, AlertCircle, ArrowRightLeft, Users } from 'lucide-react'
import { mockEmpresas } from '@/data/mockEmpresas'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export default function Dashboard() {
  const {
    totalEmpresas,
    pendentes,
    emTransicao,
    topResponsaveis,
    atividadeData,
    responsavelData,
    statusData,
    regimeData,
  } = useMemo(() => {
    const totalEmpresas = mockEmpresas.length
    const pendentes = mockEmpresas.filter((e) => e.fiscal === 'Pendente').length
    const emTransicao = mockEmpresas.filter((e) => e.novoResponsavel).length

    const countBy = (keyFn: (e: (typeof mockEmpresas)[0]) => string) => {
      return mockEmpresas.reduce(
        (acc, emp) => {
          const key = keyFn(emp)
          acc[key] = (acc[key] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
    }

    const responsavelCount = countBy((e) => e.responsavel)
    const topResponsaveis = Object.entries(responsavelCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const atividadeCount = countBy((e) => e.atividade)
    const atividadeData = Object.entries(atividadeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({ name, value, fill: COLORS[index % COLORS.length] }))

    const responsavelData = topResponsaveis.map(([name, value], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length],
    }))

    const statusCount = countBy((e) => e.fiscal)
    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
      fill: name === 'Regular' ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-5))',
    }))

    const regimeCount = countBy((e) => e.regimeTributario || 'Não Informado')
    const regimeData = Object.entries(regimeCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], index) => ({ name, value, fill: COLORS[index % COLORS.length] }))

    return {
      totalEmpresas,
      pendentes,
      emTransicao,
      topResponsaveis,
      atividadeData,
      responsavelData,
      statusData,
      regimeData,
    }
  }, [])

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Visão geral do sistema e status das empresas.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmpresas}</div>
            <p className="text-xs text-muted-foreground mt-1">Empresas cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendentes}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando verificação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Transição</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emTransicao}</div>
            <p className="text-xs text-muted-foreground mt-1">Mudança de responsável</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Responsáveis</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {topResponsaveis.length > 0 ? (
              <>
                <div className="text-xl font-bold truncate">
                  {topResponsaveis[0][0]} ({topResponsaveis[0][1]})
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex flex-col gap-1">
                  {topResponsaveis.slice(1).map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center">
                      <span className="truncate pr-2">{name}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">Nenhum dado</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Distribuição por Atividade</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{ value: { label: 'Empresas' } }} className="h-[300px] w-full">
              <PieChart>
                <Pie
                  data={atividadeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {atividadeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend className="mt-4" content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Status de Verificação</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{ value: { label: 'Empresas' } }} className="h-[300px] w-full">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend className="mt-4" content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Top 5 Responsáveis</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{ value: { label: 'Empresas' } }} className="h-[300px] w-full">
              <BarChart
                data={responsavelData}
                layout="vertical"
                margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                  {responsavelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Regime Tributário</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer config={{ value: { label: 'Empresas' } }} className="h-[300px] w-full">
              <BarChart data={regimeData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis hide />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {regimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
