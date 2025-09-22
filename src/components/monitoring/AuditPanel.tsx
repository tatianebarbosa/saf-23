import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  AlertTriangle,
  Shield,
  Activity,
  Ticket,
  CreditCard,
  Users,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditRecord {
  id: string;
  timestamp: string;
  actionType: 'ticket' | 'voucher' | 'license' | 'user' | 'system';
  action: string;
  description: string;
  user: string;
  userRole: string;
  targetEntity: string;
  targetId: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  coordinatorNotes?: string;
  coordinatorAction?: string;
  coordinatorTimestamp?: string;
  details: {
    before?: any;
    after?: any;
    additionalInfo?: string;
  };
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiresApproval: boolean;
}

const AuditPanel = () => {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AuditRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [coordinatorNotes, setCoordinatorNotes] = useState('');
  const { toast } = useToast();

  // Mock data - em produção viria do backend
  useEffect(() => {
    const mockRecords: AuditRecord[] = [
      {
        id: '1',
        timestamp: '2024-01-22T10:30:00Z',
        actionType: 'ticket',
        action: 'Ticket removido do pendente',
        description: 'Ticket #258209 foi marcado como concluído',
        user: 'João Silva',
        userRole: 'Agente SAF',
        targetEntity: 'Ticket #258209',
        targetId: '258209',
        justification: 'Problema resolvido após configuração do CRM no domínio',
        status: 'pending',
        details: {
          before: { status: 'Pendente', diasPendente: 22 },
          after: { status: 'Concluído', dataResolucao: '2024-01-22' },
          additionalInfo: 'Douglas configurou o PC do CRM conforme solicitado'
        },
        priority: 'medium',
        requiresApproval: true
      },
      {
        id: '2',
        timestamp: '2024-01-22T14:15:00Z',
        actionType: 'voucher',
        action: 'Voucher de exceção criado',
        description: 'Voucher de exceção criado para Maple Bear Camaçari',
        user: 'Ana Costa',
        userRole: 'Coordenadora',
        targetEntity: 'Maple Bear Camaçari',
        targetId: 'escola_001',
        justification: 'Escola teve problemas técnicos durante o período de campanha',
        status: 'approved',
        coordinatorNotes: 'Aprovado devido a problemas técnicos comprovados',
        coordinatorAction: 'Aprovado',
        coordinatorTimestamp: '2024-01-22T14:20:00Z',
        details: {
          before: { vouchers: 0 },
          after: { vouchers: 1, codigo: 'EXC2024001' },
          additionalInfo: 'Voucher válido até 31/03/2024'
        },
        priority: 'high',
        requiresApproval: false
      },
      {
        id: '3',
        timestamp: '2024-01-22T16:45:00Z',
        actionType: 'license',
        action: 'Licença Canva transferida',
        description: 'Licença transferida de Maria Silva para João Santos',
        user: 'Rafael Costa',
        userRole: 'Agente SAF',
        targetEntity: 'Licença Canva',
        targetId: 'lic_001',
        justification: 'Maria Silva saiu da escola, licença transferida para novo coordenador',
        status: 'pending',
        details: {
          before: { usuario: 'Maria Silva', email: 'maria@gmail.com' },
          after: { usuario: 'João Santos', email: 'joao@maplebear.com.br' },
          additionalInfo: 'Transferência necessária devido a mudança de pessoal'
        },
        priority: 'medium',
        requiresApproval: true
      },
      {
        id: '4',
        timestamp: '2024-01-21T09:20:00Z',
        actionType: 'license',
        action: 'Licença Canva removida',
        description: 'Licença removida de usuário com email não conforme',
        user: 'Fernanda Lima',
        userRole: 'Agente SAF',
        targetEntity: 'Licença Canva',
        targetId: 'lic_002',
        justification: 'Email fora do padrão Maple Bear (@gmail.com)',
        status: 'approved',
        coordinatorNotes: 'Aprovado - email realmente fora do padrão',
        coordinatorAction: 'Aprovado',
        coordinatorTimestamp: '2024-01-21T10:00:00Z',
        details: {
          before: { usuario: 'Carlos Oliveira', email: 'carlos@gmail.com', status: 'Ativa' },
          after: { status: 'Removida' },
          additionalInfo: 'Usuário orientado a usar email corporativo'
        },
        priority: 'high',
        requiresApproval: true
      },
      {
        id: '5',
        timestamp: '2024-01-20T11:30:00Z',
        actionType: 'user',
        action: 'Usuário adicionado ao sistema',
        description: 'Novo usuário cadastrado no sistema SAF',
        user: 'Sistema',
        userRole: 'Sistema',
        targetEntity: 'Usuário',
        targetId: 'user_005',
        justification: 'Cadastro automático via integração',
        status: 'approved',
        details: {
          after: { nome: 'Patricia Santos', email: 'patricia@maplebear.com.br', role: 'Professor' },
          additionalInfo: 'Cadastro via integração com RH'
        },
        priority: 'low',
        requiresApproval: false
      }
    ];

    setAuditRecords(mockRecords);
    setFilteredRecords(mockRecords);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = auditRecords.filter(record => {
      const matchesSearch = 
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.targetEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.justification.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesActionType = actionTypeFilter === 'all' || record.actionType === actionTypeFilter;
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const recordDate = new Date(record.timestamp);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            matchesDate = recordDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = recordDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = recordDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesActionType && matchesStatus && matchesDate;
    });

    setFilteredRecords(filtered);
  }, [auditRecords, searchTerm, actionTypeFilter, statusFilter, dateFilter]);

  const handleApproveAction = (recordId: string) => {
    setAuditRecords(records => records.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          status: 'approved' as const,
          coordinatorAction: 'Aprovado',
          coordinatorNotes: coordinatorNotes,
          coordinatorTimestamp: new Date().toISOString()
        };
      }
      return record;
    }));

    toast({
      title: "Ação Aprovada",
      description: "A ação foi aprovada com sucesso.",
    });

    setIsDetailDialogOpen(false);
    setCoordinatorNotes('');
    setSelectedRecord(null);
  };

  const handleRejectAction = (recordId: string) => {
    setAuditRecords(records => records.map(record => {
      if (record.id === recordId) {
        return {
          ...record,
          status: 'rejected' as const,
          coordinatorAction: 'Rejeitado',
          coordinatorNotes: coordinatorNotes,
          coordinatorTimestamp: new Date().toISOString()
        };
      }
      return record;
    }));

    toast({
      title: "Ação Rejeitada",
      description: "A ação foi rejeitada.",
      variant: "destructive"
    });

    setIsDetailDialogOpen(false);
    setCoordinatorNotes('');
    setSelectedRecord(null);
  };

  const openDetailDialog = (record: AuditRecord) => {
    setSelectedRecord(record);
    setCoordinatorNotes(record.coordinatorNotes || '');
    setIsDetailDialogOpen(true);
  };

  const getActionTypeIcon = (type: string) => {
    switch (type) {
      case 'ticket': return <Ticket className="h-4 w-4" />;
      case 'voucher': return <CreditCard className="h-4 w-4" />;
      case 'license': return <Users className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: auditRecords.length,
    pending: auditRecords.filter(r => r.status === 'pending').length,
    approved: auditRecords.filter(r => r.status === 'approved').length,
    rejected: auditRecords.filter(r => r.status === 'rejected').length,
    critical: auditRecords.filter(r => r.priority === 'critical').length
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            Painel de Auditoria - Coordenadora
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Registro completo de todas as ações realizadas no sistema SAF
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Alert para ações pendentes */}
      {stats.pending > 0 && (
        <Alert className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Existem {stats.pending} ação(ões) aguardando sua aprovação.
          </AlertDescription>
        </Alert>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ações</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Auditoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Descrição, usuário, entidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Ação</Label>
              <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="ticket">Tickets</SelectItem>
                  <SelectItem value="voucher">Vouchers</SelectItem>
                  <SelectItem value="license">Licenças</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="approved">Aprovadas</SelectItem>
                  <SelectItem value="rejected">Rejeitadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os períodos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Registros de Auditoria */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-gray-100">
                    {getActionTypeIcon(record.actionType)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{record.action}</h3>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status === 'pending' ? 'Pendente' : 
                         record.status === 'approved' ? 'Aprovada' : 'Rejeitada'}
                      </Badge>
                      <Badge className={getPriorityColor(record.priority)}>
                        {record.priority === 'critical' ? 'Crítica' :
                         record.priority === 'high' ? 'Alta' :
                         record.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{record.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{record.user} ({record.userRole})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(record.timestamp).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{record.targetEntity}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm"><strong>Justificativa:</strong> {record.justification}</p>
                    </div>
                    
                    {record.coordinatorNotes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Notas da Coordenadora:</strong> {record.coordinatorNotes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {record.coordinatorAction} em {new Date(record.coordinatorTimestamp!).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDetailDialog(record)}
                    className="gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum registro encontrado com os filtros aplicados
          </div>
        )}
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Ação</DialogTitle>
            <DialogDescription>
              {selectedRecord?.action} - {selectedRecord?.targetEntity}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Usuário:</strong> {selectedRecord.user}
                </div>
                <div>
                  <strong>Função:</strong> {selectedRecord.userRole}
                </div>
                <div>
                  <strong>Data/Hora:</strong> {new Date(selectedRecord.timestamp).toLocaleString('pt-BR')}
                </div>
                <div>
                  <strong>Prioridade:</strong> {selectedRecord.priority}
                </div>
              </div>
              
              <div>
                <strong>Descrição:</strong>
                <p className="mt-1 text-muted-foreground">{selectedRecord.description}</p>
              </div>
              
              <div>
                <strong>Justificativa:</strong>
                <p className="mt-1 text-muted-foreground">{selectedRecord.justification}</p>
              </div>
              
              {selectedRecord.details.before && (
                <div>
                  <strong>Estado Anterior:</strong>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(selectedRecord.details.before, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedRecord.details.after && (
                <div>
                  <strong>Estado Posterior:</strong>
                  <pre className="mt-1 text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(selectedRecord.details.after, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedRecord.details.additionalInfo && (
                <div>
                  <strong>Informações Adicionais:</strong>
                  <p className="mt-1 text-muted-foreground">{selectedRecord.details.additionalInfo}</p>
                </div>
              )}
              
              {selectedRecord.status === 'pending' && selectedRecord.requiresApproval && (
                <div className="space-y-2">
                  <Label>Notas da Coordenadora</Label>
                  <Textarea
                    value={coordinatorNotes}
                    onChange={(e) => setCoordinatorNotes(e.target.value)}
                    placeholder="Adicione suas observações sobre esta ação..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Fechar
            </Button>
            {selectedRecord?.status === 'pending' && selectedRecord.requiresApproval && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => handleRejectAction(selectedRecord.id)}
                  className="gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Rejeitar
                </Button>
                <Button 
                  onClick={() => handleApproveAction(selectedRecord.id)}
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Aprovar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuditPanel;
