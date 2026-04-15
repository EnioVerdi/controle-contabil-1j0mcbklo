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
  TableFooter,
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

const MONTHS = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

const PROD_YEARS = ['2024', '2025', '2026']

export default function Analytics() {
  const [empresas, setEmpresas] = useState<any[]>([])
  const [timelines, setTimelines] = useState<any[]>([])
  const [year, setYear] = useState(() => localStorage.getItem('finova_year') || '2026')
  const [loading, setLoading] = useState(true)

  // Produtividade Chart States
  const [prodMonth, setProdMonth] = useState('Todos')
  const [prodYear, setProdYear] = useState('2026')
  const [prodUser, setProdUser] = useState('Todos')
  const [prodTimeline, setProdTimeline] = useState<any[]>([])
  const [prodTempos, setProdTempos] = useState<any[]>([])

  useEffect(() => {
    localStorage.setItem('finova_year', year)
    window.dispatchEvent(new Event('finova_year_changed'))
  }, [year])

  useEffect(() => {
    const handleStorage = () => {
      const y = localStorage.getItem('finova_year')
      if (y && y !== year) setYear(y)
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('finova_year_changed', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('finova_year_changed', handleStorage)
    }
  }, [year])

  const [searchUser, setSearchUser] = useState('Todos')
  const [searchCompany, setSearchCompany] = useState('')
  const [filterTable1, setFilterTable1] = useState('')
  const [filterTable2, setFilterTable2] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: emp }, { data: tl }] = await Promise.all([
        supabase
          .from('empresas')
          .select(
            'id, nome, responsavel, regime_tributario, fiscal, created_at, profiles!empresas_responsavel_fkey(name)',
          ),
        supabase.from('empresa_timeline').select('empresa_id, status').eq('ano', parseInt(year)),
      ])
      setEmpresas(emp || [])
      setTimelines(tl || [])
      setLoading(false)
    }
    load()
  }, [year])

  useEffect(() => {
    async function loadProd() {
      const [{ data: timelineData }, { data: temposData }] = await Promise.all([
        supabase
          .from('empresa_timeline')
          .select('empresa_id, mes, ano, status, data_conclusao')
          .eq('ano', parseInt(prodYear))
          .eq('status', 'concluido'),
        supabase
          .from('tempo_orcado_empresas')
          .select('empresa_id, mes, ano, tempo_orcado')
          .eq('ano', parseInt(prodYear)),
      ])
      setProdTimeline(timelineData || [])
      setProdTempos(temposData || [])
    }
    loadProd()
  }, [prodYear])

  const { filteredEmpresas, users } = useMemo(() => {
    const fe = empresas
      .filter((e) => new Date(e.created_at).getFullYear() <= parseInt(year))
      .map((e) => ({
        ...e,
        responsavelName: e.profiles?.name || 'Não atribuído',
      }))
    return {
      filteredEmpresas: fe,
      users: Array.from(new Set(fe.map((e) => e.responsavelName).filter(Boolean))),
    }
  }, [empresas, year])

  const allUsers = useMemo(() => {
    return Array.from(
      new Set(empresas.map((e) => e.profiles?.name || 'Não atribuído').filter(Boolean)),
    ).sort()
  }, [empresas])

  const prodChartData = useMemo(() => {
    const filtered = prodTimeline.filter((t) => {
      const emp = empresas.find((e) => e.id === t.empresa_id)
      const resp = emp?.profiles?.name || 'Não atribuído'
      if (prodUser !== 'Todos' && resp !== prodUser) return false
      if (prodMonth !== 'Todos' && t.mes !== parseInt(prodMonth)) return false
      return true
    })
    const countsByMonth = Array(12).fill(0)
    filtered.forEach((t) => {
      countsByMonth[t.mes - 1] += 1
    })

    const monthsNames = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]
    return monthsNames
      .map((m, i) => ({
        mes: m,
        concluidas: countsByMonth[i],
        mesNum: i + 1,
      }))
      .filter((d) => prodMonth === 'Todos' || d.mesNum === parseInt(prodMonth))
  }, [prodTimeline, empresas, prodUser, prodMonth])

  const prodTableData = useMemo(() => {
    const filtered = prodTimeline
      .filter((t) => {
        const emp = empresas.find((e) => e.id === t.empresa_id)
        const resp = emp?.profiles?.name || 'Não atribuído'
        if (prodUser !== 'Todos' && resp !== prodUser) return false
        if (prodMonth !== 'Todos' && t.mes !== parseInt(prodMonth)) return false
        return true
      })
      .map((t) => {
        const emp = empresas.find((e) => e.id === t.empresa_id)
        let formattedDate = 'N/A'
        if (t.data_conclusao) {
          const d = new Date(t.data_conclusao)
          formattedDate = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`
        }
        const tempoObj = prodTempos.find(
          (pt) => pt.empresa_id === t.empresa_id && pt.mes === t.mes && pt.ano === t.ano,
        )
        const tempo_orcado = tempoObj ? Number(tempoObj.tempo_orcado) : 0
        return {
          id: t.empresa_id + '-' + t.mes,
          empresaNome: emp?.nome || 'Desconhecida',
          dataConclusao: formattedDate,
          responsavel: emp?.profiles?.name || 'Não atribuído',
          rawDate: t.data_conclusao ? new Date(t.data_conclusao).getTime() : 0,
          tempo_orcado,
        }
      })
      .sort((a, b) => b.rawDate - a.rawDate)
    return filtered
  }, [prodTimeline, prodTempos, empresas, prodUser, prodMonth])

  const totalTempoOrcado = useMemo(() => {
    return prodTableData.reduce((acc, curr) => acc + (curr.tempo_orcado || 0), 0)
  }, [prodTableData])

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
      const ue = filteredEmpresas.filter((e) => e.responsavelName === u)
      const d: any = { responsavel: u }
      ue.forEach((e) => {
        const s = slug(e.regime_tributario || 'Não Definido')
        d[s] = (d[s] || 0) + 1
      })
      return d
    })

    const tableData = users
      .flatMap((u) => {
        const ue = filteredEmpresas.filter((e) => e.responsavelName === u)
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
      const uIds = filteredEmpresas.filter((e) => e.responsavelName === u).map((e) => e.id)
      const t = timelines.filter((x) => uIds.includes(x.empresa_id))
      const concluidas = t.filter((x) => x.status === 'concluido').length
      const abertas = t.filter((x) => x.status === 'aberto').length
      const pendentes =
        t.filter((x) => x.status === 'nao_iniciado').length + (uIds.length * 12 - t.length)
      return {
        responsavel: u,
        concluidas,
        abertas,
        pendentes,
        total: uIds.length * 12,
      }
    })
    const config = {
      concluidas: { label: 'Concluídas', color: '#10b981' },
      abertas: { label: 'Em Aberto', color: '#f59e0b' },
      pendentes: { label: 'Pendentes', color: '#a78bfa' },
    }
    return { chartData: data, tableData: [...data].sort((a, b) => b.total - a.total), config }
  }, [filteredEmpresas, users, timelines])

  const filteredTable1 = useMemo(() => {
    return s1.tableData.filter((r) =>
      r.responsavel.toLowerCase().includes(filterTable1.toLowerCase()),
    )
  }, [s1.tableData, filterTable1])

  const filteredTable2 = useMemo(() => {
    return s2.tableData.filter((r) =>
      r.responsavel.toLowerCase().includes(filterTable2.toLowerCase()),
    )
  }, [s2.tableData, filterTable2])

  const searchResults = useMemo(
    () =>
      filteredEmpresas
        .filter(
          (e) =>
            (searchUser === 'Todos' || e.responsavelName === searchUser) &&
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
            {['2026', '2027', '2028'].map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Nova Seção: Produtividade Mensal */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Produtividade: Empresas Concluídas</CardTitle>
            <CardDescription>Acompanhamento mensal de entregas por responsável.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={prodMonth} onValueChange={setProdMonth}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Meses</SelectItem>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={prodYear} onValueChange={setProdYear}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {PROD_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={prodUser} onValueChange={setProdUser}>
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Usuário" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos os Usuários</SelectItem>
                  {allUsers.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ChartContainer
              config={{ concluidas: { label: 'Concluídas', color: '#3b82f6' } }}
              className="h-[300px] w-full"
            >
              <BarChart data={prodChartData} margin={{ top: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="mes"
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
                <Bar
                  dataKey="concluidas"
                  fill="var(--color-concluidas)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ChartContainer>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Detalhamento de Conclusões
              </h4>
              <div className="rounded-xl border border-gray-100 max-h-[250px] overflow-auto relative">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-600">Empresa</TableHead>
                      <TableHead className="font-semibold text-gray-600">
                        Data de Conclusão
                      </TableHead>
                      <TableHead className="font-semibold text-gray-600">
                        Usuário Responsável
                      </TableHead>
                      <TableHead className="text-right font-semibold text-gray-600">
                        Tempo Orçado (horas)
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prodTableData.length > 0 ? (
                      prodTableData.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium text-gray-900">
                            {r.empresaNome}
                          </TableCell>
                          <TableCell className="text-gray-600">{r.dataConclusao}</TableCell>
                          <TableCell className="text-gray-900">{r.responsavel}</TableCell>
                          <TableCell className="text-right text-gray-900">
                            {r.tempo_orcado.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                          Nenhuma empresa concluída para os filtros selecionados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  {prodTableData.length > 0 && (
                    <TableFooter className="bg-gray-50/50">
                      <TableRow>
                        <TableCell colSpan={3} className="font-semibold text-right text-gray-900">
                          Total:
                        </TableCell>
                        <TableCell className="font-bold text-right text-gray-900">
                          {totalTempoOrcado.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader>
            <CardTitle className="text-lg">Empresas por Tipo de Tributação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ChartContainer config={s1.config} className="h-[350px] lg:h-[450px] w-full">
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

            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Detalhamento por Usuário</h4>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuário..."
                  value={filterTable1}
                  onChange={(e) => setFilterTable1(e.target.value)}
                  className="pl-9 border-gray-200 rounded-xl h-9"
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 max-h-[300px] overflow-auto relative">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-600">Usuário</TableHead>
                    <TableHead className="font-semibold text-gray-600">Tributação</TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">Qtd</TableHead>
                    <TableHead className="text-right font-semibold text-gray-600">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTable1.length > 0 ? (
                    filteredTable1.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-gray-900">{r.responsavel}</TableCell>
                        <TableCell className="text-gray-600">{r.regime}</TableCell>
                        <TableCell className="text-right text-gray-900">{r.quantidade}</TableCell>
                        <TableCell className="text-right text-gray-600">{r.percentual}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                        Nenhum resultado encontrado.
                      </TableCell>
                    </TableRow>
                  )}
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
            <ChartContainer config={s2.config} className="h-[350px] lg:h-[450px] w-full">
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

            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Detalhamento por Usuário</h4>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar usuário..."
                  value={filterTable2}
                  onChange={(e) => setFilterTable2(e.target.value)}
                  className="pl-9 border-gray-200 rounded-xl h-9"
                />
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 max-h-[300px] overflow-auto relative">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
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
                  {filteredTable2.length > 0 ? (
                    filteredTable2.map((r, i) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                        Nenhum resultado encontrado.
                      </TableCell>
                    </TableRow>
                  )}
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
          <div className="rounded-xl border border-gray-100 max-h-[300px] overflow-auto relative">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-gray-50 shadow-sm">
                <TableRow className="bg-gray-50 hover:bg-gray-50">
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
