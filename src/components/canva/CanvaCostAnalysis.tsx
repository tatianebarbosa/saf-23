import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  FileText,
  Calendar,
  CreditCard
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface CostAnalysis {
  currentPlan: string;
  currentCost: number;
  expectedCost: number;
  activeUsers: number;
  costPerUser: number;
  monthlyTrend: Array<{
    month: string;
    cost: number;
    users: number;
    costPerUser: number;
  }>;
  planComparison: Array<{
    plan: string;
    cost: number;
    features: string[];
    recommended: boolean;
  }>;
}

const CanvaCostAnalysis = () => {
  const [costData, setCostData] = useState<CostAnalysis>({
    currentPlan: "Canva Pro",
    currentCost: 815.00,
    expectedCost: 289.90,
    activeUsers: 820,
    costPerUser: 0.99,
    monthlyTrend: [
      { month: 'Jan 2024', cost: 289.90, users: 650, costPerUser: 0.45 },
      { month: 'Fev 2024', cost: 350.00, users: 700, costPerUser: 0.50 },
      { month: 'Mar 2024', cost: 420.00, users: 750, costPerUser: 0.56 },
      { month: 'Abr 2024', cost: 520.00, users: 780, costPerUser: 0.67 },
      { month: 'Mai 2024', cost: 650.00, users: 800, costPerUser: 0.81 },
      { month: 'Jun 2024', cost: 815.00, users: 820, costPerUser: 0.99 }
    ],
    planComparison: [
      {
        plan: "Canva Educação (Gratuito)",
        cost: 0,
        features: ["Acesso básico", "Templates limitados", "Sem marca d'água", "Colaboração básica"],
        recommended: false
      },
      {
        plan: "Canva Pro (Individual)",
        cost: 289.90,
        features: ["Templates premium", "Remoção de fundo", "Redimensionamento mágico", "100GB armazenamento"],
        recommended: false
      },
      {
        plan: "Canva for Teams",
        cost: 815.00,
        features: ["Colaboração avançada", "Brand Kit", "Aprovações", "Armazenamento ilimitado"],
        recommended: true
      },
      {
        plan: "Canva Enterprise",
        cost: 1200.00,
        features: ["SSO", "Controles administrativos", "Suporte prioritário", "Análises avançadas"],
        recommended: false
      }
    ]
  });

  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const costIncrease = ((costData.currentCost - costData.expectedCost) / costData.expectedCost) * 100;
  const isOverBudget = costData.currentCost > costData.expectedCost;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const planDistribution = [
    { name: 'Canva Educação', value: 200, cost: 0 },
    { name: 'Canva Pro', value: 620, cost: 815 },
    { name: 'Não Utilizando', value: 180, cost: 0 }
  ];

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Análise de Custos Canva</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Análise detalhada dos custos e planos do Canva para a rede Maple Bear
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button className="gap-2 bg-red-600 hover:bg-red-700">
            <Calculator className="h-4 w-4" />
            Calcular Economia
          </Button>
        </div>
      </div>

      {/* Alert de Discrepância */}
      <Alert className={`border-l-4 ${isOverBudget ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'}`}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Discrepância Identificada:</strong> O custo atual (R$ {costData.currentCost.toFixed(2)}) está{' '}
          <span className="font-bold text-red-600">
            {costIncrease.toFixed(1)}% acima
          </span>{' '}
          do valor esperado (R$ {costData.expectedCost.toFixed(2)}). 
          Diferença de <strong>R$ {(costData.currentCost - costData.expectedCost).toFixed(2)}</strong>.
        </AlertDescription>
      </Alert>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ {costData.currentCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +{costIncrease.toFixed(1)}% vs esperado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Esperado</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {costData.expectedCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Plano original (2022)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{costData.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Licenças em uso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo por Usuário</CardTitle>
            <Calculator className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">R$ {costData.costPerUser.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Por licença/mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Tendência de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução dos Custos (6 meses)
          </CardTitle>
          <CardDescription>
            Acompanhamento da evolução dos custos e número de usuários ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costData.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="cost" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Custo (R$)"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="users" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Usuários"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparação de Planos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Comparação de Planos
            </CardTitle>
            <CardDescription>
              Análise dos diferentes planos disponíveis e suas características
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {costData.planComparison.map((plan, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg ${plan.recommended ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{plan.plan}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {plan.cost === 0 ? 'Gratuito' : `R$ ${plan.cost.toFixed(2)}`}
                    </span>
                    {plan.recommended && (
                      <Badge className="bg-green-100 text-green-800">Atual</Badge>
                    )}
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Distribuição de Uso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Distribuição de Licenças
            </CardTitle>
            <CardDescription>
              Como as licenças estão sendo utilizadas na rede
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {planDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value} usuários</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Recomendações de Otimização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Investigar Cobrança:</strong> O valor atual (R$ 815) sugere que pode estar sendo cobrado por usuário. 
              Recomenda-se verificar se o plano atual é "Canva for Teams" ao invés do "Canva Pro" individual.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Canva Educação:</strong> Considere migrar usuários elegíveis para o plano gratuito "Canva Educação", 
              que oferece recursos similares sem custo para instituições educacionais.
            </AlertDescription>
          </Alert>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Auditoria de Licenças:</strong> Realize uma auditoria para identificar usuários inativos e 
              otimizar o número de licenças pagas necessárias.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanvaCostAnalysis;
