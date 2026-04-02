import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search, Loader2 } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const slug = (t: string) =>
  (t || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_') || '_'
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4']

export default function Analytics() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [timelines, setTimelines] = useState<any[]>([])
  const [year, setYear] = useState('2024')
  const [loading, setLoading] = useState(true)
  const [searchUser, setSearchUser] = useState('Todos')
  const [searchCompany, setSearchCompany] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: emp }, { data: tl }] = await Promise.all([
        supabase
          .from('empresas')
          .select('id, nome, responsavel, regime_tributario, fiscal, created_at'),
        supabase.from('empresa_timeline').select('empresa_id, status').eq('ano', parseInt(year)),
      ])
      setEmpresas(emp || [])
      setTimelines(tl || [])
      setLoading(false)
    }
    load()
  }, [year])

  const { filteredEmpresas, users } = useMemo(() => {
    const fe = empresas.filter((e) => new Date(e.created_at).getFullYear() <= parseInt(year))
    return {
      filteredEmpresas: fe,
      users: Array.from(new Set(fe.map((e) => e.responsavel).filter(Boolean))),
    }
  }, [empresas, year])

  const s1 = useMemo(() => {
    const rMap = new Map<string, string>()
    const config: Record<string, any> = {}

    filteredEmpresas.forEach((e) =>
      rMap.set(slug(e.regime_tributario || 'Não Definido'), e.regime_tributario || 'Não Definido'),
    )
    Array.from(rMap.entries()).forEach(([s, l], i) => {
      config[s] = { label: l, color: COLORS[i % COLORS.length] }
    })

    const chartData = users.map((u) => {
      const ue = filteredEmpresas.filter((e) => e.responsavel === u)
      const d: any = { responsavel: u }
      ue.forEach((e) => {
        const s = slug(e.regime_tributario || 'Não Definido')
        d[s] = (d[s] || 0) + 1
      })
      return d
    })

    const tableData = users
      .flatMap((u) => {
        const ue = filteredEmpresas.filter((e) => e.responsavel === u)
        const counts: Record<string, number> = {}
        ue.forEach((e) => {
          const r = e.regime_tributario || 'Não Definido'
          counts[r] = (counts[r] || 0) + 1
        })
        return Object.entries(counts).map(([regime, quantidade]) => ({
          responsavel: u,
          regime,
          quantidade,
          percentual: ue.length ? ((quantidade / ue.length) * 100).toFixed(1) + '%' : '0%',
        }))
      })
      .sort((a, b) => a.responsavel.localeCompare(b.responsavel) || b.quantidade - a.quantidade)

    return { chartData, tableData, config, rMap }
  }, [filteredEmpresas, users])

  const s2 = useMemo(() => {
    const data = users.map((u) => {
      const uIds = filteredEmpresas.filter((e) => e.responsavel === u).map((e) => e.id)
      const t = timelines.filter((x) => uIds.includes(x.empresa_id))
      const concluidas = t.filter((x) => x.status === 'concluido').length
      const abertas = t.filter((x) => x.status === 'aberto').length
      const pendentes = t.filter((x) => x.status === 'nao_iniciado').length
      return {
        responsavel: u,
        concluidas,
        abertas,
        pendentes,
        total: concluidas + abertas + pendentes,
      }
    })
    const config = {
      concluidas: { label: 'Concluídas', color: '#10b981' },
      abertas: { label: 'Em Aberto', color: '#f59e0b' },
      pendentes: { label: 'Pendentes', color: '#a78bfa' },
    }
    return { chartData: data, tableData: [...data].sort((a, b) => b.total - a.total), config }
  }, [filteredEmpresas, users, timelines])

  const searchResults = useMemo(
    () =>
      filteredEmpresas
        .filter(
          (e) =>
            (searchUser === 'Todos' || e.responsavel === searchUser) &&
            (e.nome.toLowerCase().includes(searchCompany.toLowerCase()) ||
              e.id.toLowerCase().includes(searchCompany.toLowerCase())),
        )
        .sort((a, b) => a.nome.localeCompare(b.nome)),
    [filteredEmpresas, searchUser, searchCompany],
  )

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visão centralizada de desempenho e produtividade
          </p>
        </div>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px] bg-white text-gray-900 border-gray-200">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            {['2024', '2025', '2026'].map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Empresas por Tipo de Tributação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ChartContainer config={s1.config} className="h-[280px] w-full">
              <BarChart data={s1.chartData} margin={{ top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="responsavel"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  style={{ fontFamily: 'sans-serif' }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent className="bg-white/80 backdrop-blur-md border-gray-100 shadow-xl rounded-xl" />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                {Array.from(s1.rMap.keys()).map((s) => (
                  <Bar
                    key={s}
                    dataKey={s}
                    fill={`var(--color-${s})`}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                ))}
              </BarChart>
            </ChartContainer>
            <div className="rounded-xl border border-gray-100 h-[240px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-600">Usuário</TableHead>
                    <TableHead className="font-semibold text-gray-600">Tributação</TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">Qtd</TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s1.tableData.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-gray-900">{r.responsavel}</TableCell>
                      <TableCell className="text-gray-600">{r.regime}</TableCell>
                      <TableCell className="text-right text-gray-900">{r.quantidade}</TableCell>
                      <TableCell className="text-right text-gray-600">{r.percentual}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Volume de Tarefas por Usuário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ChartContainer config={s2.config} className="h-[280px] w-full">
              <BarChart data={s2.chartData} margin={{ top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="responsavel"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  style={{ fontFamily: 'sans-serif' }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent className="bg-white/80 backdrop-blur-md border-gray-100 shadow-xl rounded-xl" />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="concluidas"
                  stackId="a"
                  fill="var(--color-concluidas)"
                  radius={[0, 0, 6, 6]}
                  maxBarSize={48}
                />
                <Bar dataKey="abertas" stackId="a" fill="var(--color-abertas)" maxBarSize={48} />
                <Bar
                  dataKey="pendentes"
                  stackId="a"
                  fill="var(--color-pendentes)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ChartContainer>
            <div className="rounded-xl border border-gray-100 h-[240px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-600">Usuário</TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">
                      Concluídas
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">
                      Abertas
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">
                      Pendentes
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {s2.tableData.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-gray-900">{r.responsavel}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">
                        {r.concluidas}
                      </TableCell>
                      <TableCell className="text-right text-amber-600 font-medium">
                        {r.abertas}
                      </TableCell>
                      <TableCell className="text-right text-purple-600 font-medium">
                        {r.pendentes}
                      </TableCell>
                      <TableCell className="text-right font-bold text-gray-900">
                        {r.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader>
          <CardTitle className="text-lg">Busca de Empresas por Responsável</CardTitle>
          <CardDescription>
            Filtre o portfólio de empresas pelo membro da equipe associado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={searchUser} onValueChange={setSearchUser}>
              <SelectTrigger className="w-full sm:w-[240px] border-gray-200">
                <SelectValue placeholder="Usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os Usuários</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou código..."
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="pl-9 border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold text-gray-600">Empresa</TableHead>
                  <TableHead className="font-semibold text-gray-600">Código</TableHead>
                  <TableHead className="font-semibold text-gray-600">Tributação</TableHead>
                  <TableHead className="font-semibold text-gray-600">Status Fiscal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.length > 0 ? (
                  searchResults.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium text-gray-900">{e.nome}</TableCell>
                      <TableCell className="text-gray-500 font-mono text-xs uppercase">
                        {e.id.split('-')[0]}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {e.regime_tributario || 'Não Definido'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${e.fiscal === 'Verificada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          {e.fiscal}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                      Nenhuma empresa encontrada para os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
