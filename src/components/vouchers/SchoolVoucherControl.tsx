import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Eye,
  Edit,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface School {
  id: string;
  name: string;
  cluster: string;
  status: string;
  hasVouchers: boolean;
  voucherCount: number;
  voucherCode?: string;
  voucherSent: boolean;
  observations?: string;
}

interface ExceptionVoucher {
  id: string;
  schoolId: string;
  schoolName: string;
  voucherCode: string;
  percentage: number;
  justification: string;
  requestedBy: string;
  requestedVia: 'email' | 'ticket' | 'teams';
  createdBy: string;
  createdAt: Date;
  usageLimit: number;
  usedCount: number;
}

const SchoolVoucherControl = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [exceptionVouchers, setExceptionVouchers] = useState<ExceptionVoucher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [voucherFilter, setVoucherFilter] = useState<string>('all');
  const [showCreateException, setShowCreateException] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedSchoolForException, setSelectedSchoolForException] = useState<School | null>(null);

  // Exception voucher form state
  const [exceptionForm, setExceptionForm] = useState({
    voucherCode: '',
    percentage: 5,
    justification: '',
    requestedBy: '',
    requestedVia: 'email' as 'email' | 'ticket' | 'teams',
    usageLimit: 1
  });

  // Mock data based on CSV files
  useEffect(() => {
    const mockSchools: School[] = [
      {
        id: '10',
        name: 'Maple Bear Camaçari - Busca Vida I',
        cluster: 'Desenvolvimento',
        status: 'Ativa',
        hasVouchers: true,
        voucherCount: 8,
        voucherCode: 'MBBA2026204',
        voucherSent: true
      },
      {
        id: '100',
        name: 'Maple Bear Paulínia - Morumbi I',
        cluster: 'Potente',
        status: 'Ativa',
        hasVouchers: true,
        voucherCount: 11,
        voucherCode: 'MBSP2026181',
        voucherSent: true
      },
      {
        id: '103',
        name: 'Maple Bear Presidente Prudente - Jardim Cambuí',
        cluster: 'Potente',
        status: 'Ativa',
        hasVouchers: false,
        voucherCount: 0,
        observations: 'Pendência financeira'
      },
      {
        id: '111',
        name: 'Maple Bear São Caetano Do Sul - Santa Paula',
        cluster: 'Desenvolvimento',
        status: 'Ativa',
        hasVouchers: false,
        voucherCount: 0,
        observations: 'Aguardando renegociação financeira'
      },
      {
        id: '793',
        name: 'Maple Bear Arcoverde',
        cluster: 'Implantação',
        status: 'Implantando',
        hasVouchers: false,
        voucherCount: 0
      },
      {
        id: '790',
        name: 'Maple Bear Pindamonhangaba',
        cluster: 'Implantação',
        status: 'Implantando',
        hasVouchers: false,
        voucherCount: 0
      }
    ];

    const mockExceptions: ExceptionVoucher[] = [
      {
        id: '1',
        schoolId: 'SV001',
        schoolName: 'Maple Bear São Vicente',
        voucherCode: 'SAOVICENTE50',
        percentage: 50,
        justification: 'Solicitação especial para evento promocional',
        requestedBy: 'Jardson',
        requestedVia: 'email',
        createdBy: 'TATIANE BARBOSA DOS SANTOS XAVIER',
        createdAt: new Date('2024-01-15'),
        usageLimit: 10,
        usedCount: 3
      }
    ];

    setSchools(mockSchools);
    setExceptionVouchers(mockExceptions);
  }, []);

  // Filter schools
  useEffect(() => {
    let filtered = schools;

    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.id.includes(searchTerm) ||
        school.voucherCode?.includes(searchTerm.toUpperCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(school => school.status === statusFilter);
    }

    if (voucherFilter !== 'all') {
      if (voucherFilter === 'with_vouchers') {
        filtered = filtered.filter(school => school.hasVouchers);
      } else if (voucherFilter === 'without_vouchers') {
        filtered = filtered.filter(school => !school.hasVouchers);
      } else if (voucherFilter === 'sent') {
        filtered = filtered.filter(school => school.voucherSent);
      } else if (voucherFilter === 'not_sent') {
        filtered = filtered.filter(school => school.hasVouchers && !school.voucherSent);
      }
    }

    setFilteredSchools(filtered);
  }, [schools, searchTerm, statusFilter, voucherFilter]);

  const handleCreateException = () => {
    if (!selectedSchoolForException || !exceptionForm.voucherCode || !exceptionForm.justification) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const newException: ExceptionVoucher = {
      id: Date.now().toString(),
      schoolId: selectedSchoolForException.id,
      schoolName: selectedSchoolForException.name,
      voucherCode: exceptionForm.voucherCode.toUpperCase(),
      percentage: exceptionForm.percentage,
      justification: exceptionForm.justification,
      requestedBy: exceptionForm.requestedBy,
      requestedVia: exceptionForm.requestedVia,
      createdBy: 'ANA PAULA OLIVEIRA DE ANDRADE', // Current coordinator
      createdAt: new Date(),
      usageLimit: exceptionForm.usageLimit,
      usedCount: 0
    };

    setExceptionVouchers(prev => [...prev, newException]);
    
    // Reset form
    setExceptionForm({
      voucherCode: '',
      percentage: 5,
      justification: '',
      requestedBy: '',
      requestedVia: 'email',
      usageLimit: 1
    });
    setSelectedSchoolForException(null);
    setShowCreateException(false);

    toast.success(`Voucher de exceção criado para ${selectedSchoolForException.name}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativa':
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case 'implantando':
        return <Badge className="bg-blue-100 text-blue-800">Implantando</Badge>;
      case 'inativa':
        return <Badge variant="destructive">Inativa</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getVoucherStatusBadge = (school: School) => {
    if (!school.hasVouchers) {
      return <Badge variant="secondary">Sem Vouchers</Badge>;
    }
    if (school.voucherSent) {
      return <Badge className="bg-green-100 text-green-800">Enviado</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>;
  };

  const uniqueStatuses = [...new Set(schools.map(s => s.status))];
  const uniqueClusters = [...new Set(schools.map(s => s.cluster))];

  const totalSchools = schools.length;
  const schoolsWithVouchers = schools.filter(s => s.hasVouchers).length;
  const totalVouchers = schools.reduce((sum, school) => sum + school.voucherCount, 0);
  const sentVouchers = schools.filter(s => s.voucherSent).length;

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Controle de Vouchers por Escola
          </h1>
          <p className="text-muted-foreground">
            Gerencie vouchers regulares e de exceção para todas as escolas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowHistory(true)}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            Histórico
          </Button>
          <Button 
            onClick={() => setShowCreateException(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Voucher de Exceção
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Escolas</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalSchools}</div>
            <p className="text-xs text-muted-foreground">
              Todas as unidades cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Vouchers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{schoolsWithVouchers}</div>
            <p className="text-xs text-muted-foreground">
              {((schoolsWithVouchers / totalSchools) * 100).toFixed(1)}% das escolas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vouchers</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalVouchers}</div>
            <p className="text-xs text-muted-foreground">
              Vouchers distribuídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exceções</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{exceptionVouchers.length}</div>
            <p className="text-xs text-muted-foreground">
              Vouchers especiais
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
                placeholder="Buscar por escola, ID ou código de voucher..."
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

            <Select value={voucherFilter} onValueChange={setVoucherFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status Voucher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="with_vouchers">Com Vouchers</SelectItem>
                <SelectItem value="without_vouchers">Sem Vouchers</SelectItem>
                <SelectItem value="sent">Enviados</SelectItem>
                <SelectItem value="not_sent">Não Enviados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Escolas e Vouchers ({filteredSchools.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Escola</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cluster</TableHead>
                <TableHead>Vouchers</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Status Envio</TableHead>
                <TableHead>Observações</TableHead>
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
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{school.voucherCount}</span>
                      {school.voucherCount > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {school.voucherCount} vouchers
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {school.voucherCode ? (
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {school.voucherCode}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {getVoucherStatusBadge(school)}
                  </TableCell>
                  
                  <TableCell>
                    {school.observations ? (
                      <span className="text-sm text-muted-foreground">
                        {school.observations}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedSchoolForException(school);
                          setShowCreateException(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
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

      {/* Create Exception Dialog */}
      <Dialog open={showCreateException} onOpenChange={setShowCreateException}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Voucher de Exceção</DialogTitle>
            <DialogDescription>
              {selectedSchoolForException ? 
                `Criar voucher especial para ${selectedSchoolForException.name}` :
                'Selecione uma escola para criar o voucher'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Código do Voucher *</label>
              <Input
                value={exceptionForm.voucherCode}
                onChange={(e) => setExceptionForm(prev => ({ ...prev, voucherCode: e.target.value }))}
                placeholder="Ex: ESCOLA2026ESPECIAL"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Percentual de Desconto *</label>
              <Select 
                value={exceptionForm.percentage.toString()} 
                onValueChange={(value) => setExceptionForm(prev => ({ ...prev, percentage: parseInt(value) }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="15">15%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                  <SelectItem value="25">25%</SelectItem>
                  <SelectItem value="50">50%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Justificativa *</label>
              <Textarea
                value={exceptionForm.justification}
                onChange={(e) => setExceptionForm(prev => ({ ...prev, justification: e.target.value }))}
                placeholder="Descreva o motivo da exceção..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Solicitado por</label>
              <Input
                value={exceptionForm.requestedBy}
                onChange={(e) => setExceptionForm(prev => ({ ...prev, requestedBy: e.target.value }))}
                placeholder="Nome de quem solicitou"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Solicitado via</label>
              <Select 
                value={exceptionForm.requestedVia} 
                onValueChange={(value: 'email' | 'ticket' | 'teams') => 
                  setExceptionForm(prev => ({ ...prev, requestedVia: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="ticket">Ticket</SelectItem>
                  <SelectItem value="teams">Teams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Limite de Uso</label>
              <Input
                type="number"
                value={exceptionForm.usageLimit}
                onChange={(e) => setExceptionForm(prev => ({ ...prev, usageLimit: parseInt(e.target.value) || 1 }))}
                min="1"
                className="mt-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateException(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateException}>
              Criar Voucher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Vouchers de Exceção</DialogTitle>
            <DialogDescription>
              Registro de todos os vouchers especiais criados
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Desconto</TableHead>
                  <TableHead>Solicitado por</TableHead>
                  <TableHead>Criado por</TableHead>
                  <TableHead>Uso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exceptionVouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>
                      {voucher.createdAt.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>{voucher.schoolName}</TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {voucher.voucherCode}
                      </code>
                    </TableCell>
                    <TableCell>{voucher.percentage}%</TableCell>
                    <TableCell>{voucher.requestedBy}</TableCell>
                    <TableCell>{voucher.createdBy}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {voucher.usedCount}/{voucher.usageLimit}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {exceptionVouchers.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                Nenhum voucher de exceção criado ainda.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHistory(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolVoucherControl;

