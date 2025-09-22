import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Download,
  Upload,
  Plus,
  Filter,
  TrendingUp,
  Palette,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CanvaUser {
  id: string;
  name: string;
  email: string;
  role: string;
  school: string;
  schoolId: string;
  status: 'active' | 'inactive';
  isValidDomain: boolean;
  updatedAt: string;
}

interface SchoolLicense {
  id: string;
  name: string;
  status: string;
  cluster: string;
  safResponsible: string;
  totalLicenses: number;
  usedLicenses: number;
  users: CanvaUser[];
  hasExcess: boolean;
  invalidUsers: number;
}

const EnhancedCanvaDashboard = () => {
  const [schools, setSchools] = useState<SchoolLicense[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolLicense[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [showOnlyProblems, setShowOnlyProblems] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data based on the CSV files structure
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Simulate loading real data
      const mockSchools: SchoolLicense[] = [
        {
          id: '793',
          name: 'Maple Bear Arcoverde',
          status: 'Implantando',
          cluster: 'Implantação',
          safResponsible: 'TATIANE BARBOSA DOS SANTOS XAVIER',
          totalLicenses: 3,
          usedLicenses: 2,
          hasExcess: false,
          invalidUsers: 0,
          users: [
            {
              id: '1',
              name: 'João Silva',
              email: 'joao.silva@maplebear.com.br',
              role: 'Estudante',
              school: 'Maple Bear Arcoverde',
              schoolId: '793',
              status: 'active',
              isValidDomain: true,
              updatedAt: '2024-01-15'
            },
            {
              id: '2',
              name: 'Maria Santos',
              email: 'maria.santos@gmail.com',
              role: 'Estudante',
              school: 'Maple Bear Arcoverde',
              schoolId: '793',
              status: 'active',
              isValidDomain: false,
              updatedAt: '2024-02-01'
            }
          ]
        },
        {
          id: '790',
          name: 'Maple Bear Pindamonhangaba',
          status: 'Implantando',
          cluster: 'Implantação',
          safResponsible: 'TATIANE BARBOSA DOS SANTOS XAVIER',
          totalLicenses: 3,
          usedLicenses: 1,
          hasExcess: false,
          invalidUsers: 0,
          users: [
            {
              id: '3',
              name: 'Pedro Oliveira',
              email: 'pedro.oliveira@maplebear.com.br',
              role: 'Estudante',
              school: 'Maple Bear Pindamonhangaba',
              schoolId: '790',
              status: 'active',
              isValidDomain: true,
              updatedAt: '2024-01-20'
            }
          ]
        },
        {
          id: '830',
          name: 'Maple Bear Goiânia - Marista II',
          status: 'Operando',
          cluster: 'Alta Performance',
          safResponsible: 'INGRID VANIA MAZZEI DE OLIVEIRA',
          totalLicenses: 6,
          usedLicenses: 8,
          hasExcess: true,
          invalidUsers: 2,
          users: Array.from({ length: 8 }, (_, i) => ({
            id: `goiania_${i}`,
            name: `Usuário ${i + 1}`,
            email: i < 6 ? `usuario${i + 1}@maplebear.com.br` : `usuario${i + 1}@gmail.com`,
            role: 'Estudante',
            school: 'Maple Bear Goiânia - Marista II',
            schoolId: '830',
            status: 'active' as const,
            isValidDomain: i < 6,
            updatedAt: '2024-01-10'
          }))
        },
        {
          id: '299',
          name: 'Maple Bear São Roque',
          status: 'Operando',
          cluster: 'Potente',
          safResponsible: 'Joao Felipe Gutierrez de Freitas',
          totalLicenses: 5,
          usedLicenses: 3,
          hasExcess: false,
          invalidUsers: 1,
          users: [
            {
              id: '4',
              name: 'Ana Costa',
              email: 'ana.costa@maplebear.com.br',
              role: 'Estudante',
              school: 'Maple Bear São Roque',
              schoolId: '299',
              status: 'active',
              isValidDomain: true,
              updatedAt: '2024-01-10'
            },
            {
              id: '5',
              name: 'Carlos Ferreira',
              email: 'carlos.ferreira@hotmail.com',
              role: 'Estudante',
              school: 'Maple Bear São Roque',
              schoolId: '299',
              status: 'active',
              isValidDomain: false,
              updatedAt: '2024-01-25'
            },
            {
              id: '6',
              name: 'Lucia Mendes',
              email: 'lucia.mendes@maplebear.com.br',
              role: 'Estudante',
              school: 'Maple Bear São Roque',
              schoolId: '299',
              status: 'active',
              isValidDomain: true,
              updatedAt: '2024-02-05'
            }
          ]
        }
      ];

      // Update invalid users count
      mockSchools.forEach(school => {
        school.invalidUsers = school.users.filter(user => !user.isValidDomain).length;
      });

      setSchools(mockSchools);
      setLoading(false);
    };

    loadData();
  }, []);

  // Filter schools based on search and filters
  useEffect(() => {
    let filtered = schools;

    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.id.includes(searchTerm) ||
        school.safResponsible.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(school => school.status === statusFilter);
    }

    if (clusterFilter !== 'all') {
      filtered = filtered.filter(school => school.cluster === clusterFilter);
    }

    if (showOnlyProblems) {
      filtered = filtered.filter(school => school.hasExcess || school.invalidUsers > 0);
    }

    setFilteredSchools(filtered);
  }, [schools, searchTerm, statusFilter, clusterFilter, showOnlyProblems]);

  const getTotalStats = () => {
    const totalLicenses = schools.reduce((sum, school) => sum + school.totalLicenses, 0);
    const usedLicenses = schools.reduce((sum, school) => sum + school.usedLicenses, 0);
    const excessLicenses = schools.reduce((sum, school) => 
      sum + Math.max(0, school.usedLicenses - school.totalLicenses), 0
    );
    const invalidUsers = schools.reduce((sum, school) => sum + school.invalidUsers, 0);
    const paidLicenses = 815;
    const utilizationRate = (usedLicenses / paidLicenses) * 100;

    return { totalLicenses, usedLicenses, excessLicenses, invalidUsers, paidLicenses, utilizationRate };
  };

  const stats = getTotalStats();

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operando':
        return <Badge className="bg-green-100 text-green-800">Operando</Badge>;
      case 'implantando':
        return <Badge className="bg-blue-100 text-blue-800">Implantando</Badge>;
      case 'desenvolvimento':
        return <Badge className="bg-yellow-100 text-yellow-800">Desenvolvimento</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getLicenseStatusBadge = (school: SchoolLicense) => {
    if (school.hasExcess) {
      return <Badge variant="destructive">Excesso: +{school.usedLicenses - school.totalLicenses}</Badge>;
    }
    if (school.usedLicenses === school.totalLicenses) {
      return <Badge className="bg-orange-100 text-orange-800">Limite</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Normal</Badge>;
  };

  const uniqueStatuses = [...new Set(schools.map(s => s.status))];
  const uniqueClusters = [...new Set(schools.map(s => s.cluster))];

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette className="h-8 w-8 text-primary" />
            Dashboard Canva Completo
          </h1>
          <p className="text-muted-foreground">
            Visão completa das licenças Canva por unidade escolar
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Importar Dados
          </Button>
        </div>
      </div>

      {/* Summary Cards *            {/* Canva Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-800">Pagamento Atual</span>
                  <TrendingUp className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-2xl font-bold text-red-600">R$ 815</p>
                <p className="text-xs text-red-600">Fatura anual 2025</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Plano Ideal</span>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-600">R$ 289,90</p>
                <p className="text-xs text-green-600">Canva Pro anual</p>
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Análise de Custos</p>
                  <p className="text-xs text-orange-600">
                    Pagando R$ 525,10 a mais que o plano Canva Pro básico
                  </p>
                  <p className="text-xs text-orange-600">
                    Para 820 licenças ativas: R$ {(815/820).toFixed(2)}/licença/ano
                  </p>
                  <p className="text-xs text-orange-600">
                    Plano ideal: R$ {(289.90/820).toFixed(2)}/licença/ano
                  </p>
                </div>
              </div>
            </div>/CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excesso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.excessLicenses}</div>
            <p className="text-xs text-muted-foreground">
              Licenças em excesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domínios Inválidos</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.invalidUsers}</div>
            <p className="text-xs text-muted-foreground">
              Fora da política
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Ativas</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{schools.length}</div>
            <p className="text-xs text-muted-foreground">
              Unidades cadastradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por escola, ID ou responsável SAF..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status da Escola" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                {uniqueStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={clusterFilter} onValueChange={setClusterFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clusters</SelectItem>
                {uniqueClusters.map(cluster => (
                  <SelectItem key={cluster} value={cluster}>{cluster}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showOnlyProblems ? "default" : "outline"}
              onClick={() => setShowOnlyProblems(!showOnlyProblems)}
              className="gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Apenas Problemas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Escolas e Licenças ({filteredSchools.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Escola</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Responsável SAF</TableHead>
                <TableHead>Licenças</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Problemas</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {school.id}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {getStatusBadge(school.status)}
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline">{school.cluster}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-sm">{school.safResponsible}</p>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {school.usedLicenses}/{school.totalLicenses}
                      </span>
                      {getLicenseStatusBadge(school)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{school.users.length}</span>
                      {school.users.length > 0 && (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {school.hasExcess && (
                        <Badge variant="destructive" className="text-xs">
                          Excesso
                        </Badge>
                      )}
                      {school.invalidUsers > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {school.invalidUsers} domínio(s) inválido(s)
                        </Badge>
                      )}
                      {!school.hasExcess && school.invalidUsers === 0 && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          OK
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredSchools.length === 0 && (
            <div className="py-16 text-center">
              <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">Nenhuma escola encontrada</h3>
              <p className="text-muted-foreground">
                Ajuste os filtros para ver mais resultados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedCanvaDashboard;

