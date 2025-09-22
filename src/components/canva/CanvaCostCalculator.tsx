import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Building,
  Users,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const CanvaCostCalculator = () => {
  const [numberOfSchools, setNumberOfSchools] = useState(240);
  const [licensesPerSchool, setLicensesPerSchool] = useState(2);
  const [activeLicenses, setActiveLicenses] = useState(820); // Licenças realmente ativas
  
  // Valores baseados na fatura real
  const canvaProPlanPrice = 289.90; // Preço do plano Canva Pro anual
  const currentAnnualBill = 815.00; // Valor cobrado na fatura atual
  
  // Cálculos
  const totalLicensesNeeded = numberOfSchools * licensesPerSchool;
  const idealCost = canvaProPlanPrice; // Para o plano básico
  const currentCost = currentAnnualBill;
  const overpayment = currentCost - idealCost;
  const costPerLicense = currentCost / activeLicenses; // Usando licenças ativas reais
  const idealCostPerLicense = idealCost / activeLicenses;
  
  // Análise de cenários
  const scenarios = [
    {
      name: 'Cenário Atual',
      description: 'Pagamento atual baseado na fatura (R$ 815/ano)',
      totalCost: currentCost,
      costPerLicense: costPerLicense,
      isCurrentPlan: true
    },
    {
      name: 'Plano Canva Pro',
      description: 'Plano básico conforme fatura original (R$ 289,90/ano)',
      totalCost: idealCost,
      costPerLicense: idealCostPerLicense,
      isCurrentPlan: false
    },
    {
      name: 'Plano Corporativo',
      description: `Negociação para ${activeLicenses} licenças com desconto`,
      totalCost: idealCost * 0.7, // 30% desconto hipotético
      costPerLicense: (idealCost * 0.7) / activeLicenses,
      isCurrentPlan: false
    }
  ];

  const handleRecalculate = () => {
    toast.success('Cálculos atualizados com os novos valores');
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            Calculadora de Custos Canva
          </h1>
          <p className="text-muted-foreground">
            Análise de custos e otimização do plano Canva para as escolas Maple Bear
          </p>
        </div>
        
        <Button onClick={handleRecalculate} className="gap-2">
          <TrendingUp className="h-4 w-4" />
          Recalcular
        </Button>
      </div>

      {/* Current Situation Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800">Análise da Fatura Atual</h3>
              <p className="text-sm text-orange-700 mt-1">
                Baseado na fatura de abril/2022, o plano Canva Pro custava <strong>R$ 289,90 anuais</strong>. 
                Atualmente estamos pagando <strong>R$ 815,00 anuais</strong>, uma diferença de <strong>R$ {overpayment.toFixed(2)}</strong>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-500" />
              Parâmetros de Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Número de Escolas</label>
              <Input
                type="number"
                value={numberOfSchools}
                onChange={(e) => setNumberOfSchools(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Total de unidades Maple Bear ativas
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Licenças por Escola</label>
              <Input
                type="number"
                value={licensesPerSchool}
                onChange={(e) => setLicensesPerSchool(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Quantidade padrão de licenças por unidade
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Licenças Ativas Reais</label>
              <Input
                type="number"
                value={activeLicenses}
                onChange={(e) => setActiveLicenses(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usuários realmente ativos no Canva (baseado no CSV: 824 usuários)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-red-800">Pagamento Atual</p>
                <p className="text-xl font-bold text-red-600">R$ {currentCost.toFixed(2)}</p>
                <p className="text-xs text-red-600">Por ano</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-green-800">Plano Ideal</p>
                <p className="text-xl font-bold text-green-600">R$ {idealCost.toFixed(2)}</p>
                <p className="text-xs text-green-600">Canva Pro</p>
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Pagamento a Mais</p>
              <p className="text-2xl font-bold text-orange-600">R$ {overpayment.toFixed(2)}</p>
              <p className="text-xs text-orange-600">
                {((overpayment / idealCost) * 100).toFixed(1)}% acima do ideal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* License Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenças Ativas</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeLicenses}</div>
            <p className="text-xs text-muted-foreground">
              Usuários reais no sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licenças Teóricas</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalLicensesNeeded}</div>
            <p className="text-xs text-muted-foreground">
              {numberOfSchools} escolas × {licensesPerSchool} licenças
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo por Licença Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ {costPerLicense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Por licença ativa/ano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo por Licença Ideal</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {idealCostPerLicense.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Plano Canva Pro
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scenario Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Cenários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div key={index} className={`p-4 rounded-lg border ${
                scenario.isCurrentPlan ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {scenario.name}
                      {scenario.isCurrentPlan && (
                        <Badge variant="destructive" className="text-xs">Atual</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">R$ {scenario.totalCost.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      R$ {scenario.costPerLicense.toFixed(2)}/licença
                    </p>
                  </div>
                </div>
                
                {!scenario.isCurrentPlan && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm text-green-600">
                      💰 Economia: R$ {(currentCost - scenario.totalCost).toFixed(2)} por ano
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800">Revisar Plano Atual</h4>
                <p className="text-sm text-blue-700">
                  Verificar se o plano atual está adequado ao número real de usuários ativos. 
                  Pode haver licenças não utilizadas sendo cobradas.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800">Negociar Desconto Corporativo</h4>
                <p className="text-sm text-green-700">
                  Com {totalLicensesNeeded} licenças, é possível negociar um desconto corporativo 
                  significativo com a Canva.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-800">Otimizar Distribuição</h4>
                <p className="text-sm text-purple-700">
                  Implementar controle rigoroso de licenças por escola para evitar desperdício 
                  e garantir uso eficiente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CanvaCostCalculator;

