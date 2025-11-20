import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';

export function ReportsPage() {
  // Dados mockados para os gráficos
  const ticketsByDay = [
    { day: 'Seg', abertos: 12, resolvidos: 8 },
    { day: 'Ter', abertos: 15, resolvidos: 10 },
    { day: 'Qua', abertos: 8, resolvidos: 12 },
    { day: 'Qui', abertos: 18, resolvidos: 14 },
    { day: 'Sex', abertos: 20, resolvidos: 16 },
  ];

  const ticketsByCategory = [
    { name: 'Hardware', value: 30 },
    { name: 'Software', value: 45 },
    { name: 'Rede', value: 20 },
    { name: 'Email', value: 15 },
    { name: 'Acesso', value: 25 },
  ];

  const responseTime = [
    { month: 'Jul', tempo: 4.2 },
    { month: 'Ago', tempo: 3.8 },
    { month: 'Set', tempo: 3.5 },
    { month: 'Out', tempo: 3.2 },
    { month: 'Nov', tempo: 2.9 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 mb-2">Relatórios e Análises</h2>
          <p className="text-slate-600">
            Visualize métricas e estatísticas do sistema de helpdesk
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="last-30-days">
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
              <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
              <SelectItem value="last-90-days">Últimos 90 dias</SelectItem>
              <SelectItem value="this-year">Este ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600">Tempo Médio de Resposta</p>
              <Clock className="size-5 text-blue-600" />
            </div>
            <p className="text-slate-900 mb-1">2.9 horas</p>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingDown className="size-4" />
              <span>-12% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600">Taxa de Resolução</p>
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <p className="text-slate-900 mb-1">87%</p>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="size-4" />
              <span>+5% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600">Chamados Abertos</p>
              <TrendingUp className="size-5 text-orange-600" />
            </div>
            <p className="text-slate-900 mb-1">73</p>
            <div className="flex items-center gap-1 text-orange-600">
              <TrendingUp className="size-4" />
              <span>+8% vs mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-600">Satisfação do Cliente</p>
              <span className="text-yellow-500">★</span>
            </div>
            <p className="text-slate-900 mb-1">4.6/5.0</p>
            <div className="flex items-center gap-1 text-green-600">
              <TrendingUp className="size-4" />
              <span>+0.3 vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chamados por Dia</CardTitle>
              <CardDescription>
                Comparação entre chamados abertos e resolvidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketsByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="abertos" fill="#3b82f6" name="Abertos" />
                  <Bar dataKey="resolvidos" fill="#10b981" name="Resolvidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>
                  Total de chamados por tipo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ticketsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ticketsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chamados por Status</CardTitle>
                <CardDescription>
                  Situação atual dos chamados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-orange-500" />
                      <span className="text-slate-700">Abertos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">23</span>
                      <span className="text-slate-600">31.5%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-blue-500" />
                      <span className="text-slate-700">Em Andamento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">18</span>
                      <span className="text-slate-600">24.7%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-green-500" />
                      <span className="text-slate-700">Resolvidos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">28</span>
                      <span className="text-slate-600">38.4%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-slate-400" />
                      <span className="text-slate-700">Fechados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">4</span>
                      <span className="text-slate-600">5.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Tempo Médio de Resposta</CardTitle>
              <CardDescription>
                Evolução do tempo de resposta ao longo dos meses (em horas)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="tempo" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Tempo (horas)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Análise por Categoria</CardTitle>
              <CardDescription>
                Detalhamento de chamados por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticketsByCategory.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900">{category.name}</span>
                      <span className="text-slate-600">{category.value} chamados</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(category.value / 135) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
