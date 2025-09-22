import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Search, 
  Bell,
  Send,
  Eye,
  Filter,
  RefreshCw,
  MessageSquare,
  Users,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

interface Ticket {
  id: string;
  numero: string;
  responsavel: string;
  agenteSAF: string;
  diasPendente: number;
  status: 'Pendente' | 'Em Andamento' | 'Concluído';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  observacao: string;
  dataVencimento: Date;
  dataUltimaAtualizacao: Date;
  quemAbriu: string;
  justificativa?: string;
  historico: Array<{
    data: Date;
    usuario: string;
    acao: string;
    detalhes: string;
  }>;
  notificacoes: Array<{
    id: string;
    data: Date;
    remetente: string;
    destinatarios: string[];
    mensagem: string;
    tipo: 'info' | 'warning' | 'urgent';
    visualizada: boolean;
  }>;
}

interface NotificationData {
  destinatarios: string[];
  mensagem: string;
  tipo: 'info' | 'warning' | 'urgent';
}

// Mock data baseado no sistema Kanban
const mockTickets: Ticket[] = [
  {
    id: '1',
    numero: '#258209',
    responsavel: 'João',
    agenteSAF: 'Douglas',
    diasPendente: 22,
    status: 'Pendente',
    prioridade: 'Crítica',
    observacao: 'aguardando dados, para Douglas colocar no dominio o PC do CRM',
    dataVencimento: new Date('2024-02-15'),
    dataUltimaAtualizacao: new Date('2024-08-31'),
    quemAbriu: 'Maria Silva',
    historico: [
      { data: new Date('2024-08-31'), usuario: 'João', acao: 'Criou ticket', detalhes: 'Ticket criado para configuração CRM' }
    ],
    notificacoes: []
  },
  {
    id: '2',
    numero: '#258809',
    responsavel: 'João',
    agenteSAF: 'Fernanda Inacio',
    diasPendente: 17,
    status: 'Pendente',
    prioridade: 'Alta',
    observacao: 'esse caso quem está verificando é Fernanda Inacio de Edtech',
    dataVencimento: new Date('2024-02-20'),
    dataUltimaAtualizacao: new Date('2024-09-05'),
    quemAbriu: 'Carlos Santos',
    historico: [
      { data: new Date('2024-09-05'), usuario: 'João', acao: 'Atualização', detalhes: 'Transferido para Fernanda Inacio de Edtech' }
    ],
    notificacoes: []
  },
  {
    id: '3',
    numero: '#259134',
    responsavel: 'Tati',
    agenteSAF: 'Iago',
    diasPendente: 25,
    status: 'Em Andamento',
    prioridade: 'Crítica',
    observacao: 'Ainda sendo tratado deste caso com o Iago',
    dataVencimento: new Date('2024-02-10'),
    dataUltimaAtualizacao: new Date('2024-08-28'),
    quemAbriu: 'Ana Costa',
    historico: [
      { data: new Date('2024-08-28'), usuario: 'Tati', acao: 'Em andamento', detalhes: 'Caso sendo tratado com Iago' }
    ],
    notificacoes: []
  },
  {
    id: '4',
    numero: '#258993',
    responsavel: 'Ingrid',
    agenteSAF: 'Eduardo',
    diasPendente: 20,
    status: 'Pendente',
    prioridade: 'Crítica',
    observacao: 'aguardando retorno do eduardo, há 20 dias pendente',
    dataVencimento: new Date('2024-02-12'),
    dataUltimaAtualizacao: new Date('2024-09-01'),
    quemAbriu: 'Rafael Lima',
    historico: [
      { data: new Date('2024-09-01'), usuario: 'Ingrid', acao: 'Aguardando', detalhes: 'Aguardando retorno do Eduardo' }
    ],
    notificacoes: []
  },
  {
    id: '5',
    numero: '#261211',
    responsavel: 'João',
    agenteSAF: 'Toddle',
    diasPendente: 1,
    status: 'Em Andamento',
    prioridade: 'Média',
    observacao: 'recebemos evidencias hoje, enviado clickup toddle 261211',
    dataVencimento: new Date('2024-02-25'),
    dataUltimaAtualizacao: new Date('2024-09-21'),
    quemAbriu: 'Fernanda Costa',
    historico: [
      { data: new Date('2024-09-21'), usuario: 'João', acao: 'Evidências recebidas', detalhes: 'Evidências enviadas para Toddle' }
    ],
    notificacoes: []
  }
];

const MonitoringPortal = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(mockTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [notificationData, setNotificationData] = useState<NotificationData>({
    destinatarios: [],
    mensagem: '',
    tipo: 'info'
  });
  const { toast } = useToast();

  const [newTicket, setNewTicket] = useState({
    numero: '',
    responsavel: '',
    agenteSAF: '',
    observacao: '',
    status: 'Pendente' as const,
    prioridade: 'Média' as const,
    quemAbriu: ''
  });

  // Aplicar filtros
  useEffect(() => {
    let filtered = tickets.filter(ticket => {
      const matchesSearch = ticket.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.observacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.agenteSAF.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || ticket.prioridade === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const handleCreateTicket = () => {
    if (!newTicket.numero || !newTicket.responsavel || !newTicket.observacao || !newTicket.quemAbriu) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const ticket: Ticket = {
      id: Date.now().toString(),
      numero: newTicket.numero,
      responsavel: newTicket.responsavel,
      agenteSAF: newTicket.agenteSAF,
      diasPendente: 0,
      status: newTicket.status,
      prioridade: newTicket.prioridade,
      observacao: newTicket.observacao,
      dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
      dataUltimaAtualizacao: new Date(),
      quemAbriu: newTicket.quemAbriu,
      historico: [
        {
          data: new Date(),
          usuario: 'Ana (Monitoria)',
          acao: 'Ticket criado',
          detalhes: `Ticket criado via painel de monitoria`
        }
      ],
      notificacoes: []
    };

    setTickets([ticket, ...tickets]);
    setNewTicket({ 
      numero: '', 
      responsavel: '', 
      agenteSAF: '', 
      observacao: '', 
      status: 'Pendente', 
      prioridade: 'Média',
      quemAbriu: ''
    });
    setIsCreateDialogOpen(false);
    
    toast({
      title: "Sucesso",
      description: "Ticket criado com sucesso!",
    });
  };

  const handleSendNotification = () => {
    if (!selectedTicket || !notificationData.mensagem.trim() || notificationData.destinatarios.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione destinatários e escreva uma mensagem",
        variant: "destructive",
      });
      return;
    }

    const notification = {
      id: Date.now().toString(),
      data: new Date(),
      remetente: 'Ana (Monitoria)',
      destinatarios: notificationData.destinatarios,
      mensagem: notificationData.mensagem,
      tipo: notificationData.tipo,
      visualizada: false
    };

    // Atualizar o ticket com a nova notificação
    setTickets(tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        return {
          ...ticket,
          notificacoes: [...ticket.notificacoes, notification],
          historico: [
            ...ticket.historico,
            {
              data: new Date(),
              usuario: 'Ana (Monitoria)',
              acao: 'Notificação enviada',
              detalhes: `Notificação ${notificationData.tipo} enviada para: ${notificationData.destinatarios.join(', ')}`
            }
          ]
        };
      }
      return ticket;
    }));

    // Reset
    setNotificationData({ destinatarios: [], mensagem: '', tipo: 'info' });
    setIsNotificationDialogOpen(false);
    setSelectedTicket(null);

    toast({
      title: "Notificação Enviada",
      description: `Notificação enviada para ${notificationData.destinatarios.length} destinatário(s)`,
    });
  };

  const openNotificationDialog = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsNotificationDialogOpen(true);
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200';
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-red-100 text-red-800';
      case 'Em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Concluído': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: tickets.length,
    pendentes: tickets.filter(t => t.status === 'Pendente').length,
    emAndamento: tickets.filter(t => t.status === 'Em Andamento').length,
    concluidos: tickets.filter(t => t.status === 'Concluído').length,
    criticos: tickets.filter(t => t.diasPendente >= 15).length,
    vencidos: tickets.filter(t => new Date() > t.dataVencimento).length
  };

  const agentesDisponiveis = ['João', 'Ingrid', 'Tati', 'Rafha', 'Jaque', 'Jessika', 'Fernanda', 'Douglas', 'Eduardo', 'Iago'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            Portal de Monitoramento - Ana
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitore todos os tickets do Kanban e envie notificações para a equipe
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Novo Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Criar Novo Ticket</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="numero">Número do Ticket*</Label>
                  <Input
                    id="numero"
                    placeholder="#123456"
                    value={newTicket.numero}
                    onChange={(e) => setNewTicket({ ...newTicket, numero: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="quemAbriu">Quem Abriu o Chamado*</Label>
                  <Input
                    id="quemAbriu"
                    placeholder="Nome de quem solicitou"
                    value={newTicket.quemAbriu}
                    onChange={(e) => setNewTicket({ ...newTicket, quemAbriu: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="responsavel">Responsável*</Label>
                  <Select value={newTicket.responsavel} onValueChange={(value) => setNewTicket({ ...newTicket, responsavel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentesDisponiveis.map(agente => (
                        <SelectItem key={agente} value={agente}>{agente}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="agenteSAF">Agente SAF</Label>
                  <Input
                    id="agenteSAF"
                    placeholder="Agente SAF responsável"
                    value={newTicket.agenteSAF}
                    onChange={(e) => setNewTicket({ ...newTicket, agenteSAF: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="prioridade">Prioridade</Label>
                  <Select value={newTicket.prioridade} onValueChange={(value: any) => setNewTicket({ ...newTicket, prioridade: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Crítica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="observacao">Observação*</Label>
                  <Textarea
                    id="observacao"
                    placeholder="Descreva o problema ou solicitação..."
                    value={newTicket.observacao}
                    onChange={(e) => setNewTicket({ ...newTicket, observacao: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateTicket} className="w-full">
                  Criar Ticket
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.pendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{stats.emAndamento}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-2xl font-bold">{stats.concluidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Críticos (15+ dias)</p>
                <p className="text-2xl font-bold">{stats.criticos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-700" />
              <div>
                <p className="text-sm text-muted-foreground">Vencidos</p>
                <p className="text-2xl font-bold">{stats.vencidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Monitoramento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Número, responsável, observação..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as prioridades</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle>Tickets do Kanban ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={`border rounded-lg p-4 border-l-4 ${
                  ticket.prioridade === 'Crítica' ? 'border-l-red-500' :
                  ticket.prioridade === 'Alta' ? 'border-l-orange-500' :
                  ticket.prioridade === 'Média' ? 'border-l-yellow-500' :
                  'border-l-green-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-lg">{ticket.numero}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.prioridade)}>
                        {ticket.prioridade}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        {ticket.responsavel}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {ticket.diasPendente} dias
                      </div>
                      {ticket.diasPendente >= 15 && (
                        <Badge className="bg-red-100 text-red-800">CRÍTICO</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>Quem abriu: <span className="font-medium">{ticket.quemAbriu}</span></div>
                      <div>Agente SAF: <span className="font-medium">{ticket.agenteSAF}</span></div>
                      <div>Vencimento: <span className="font-medium">{ticket.dataVencimento.toLocaleDateString('pt-BR')}</span></div>
                      <div>Notificações: <span className="font-medium">{ticket.notificacoes.length}</span></div>
                    </div>
                    
                    <p className="text-muted-foreground">{ticket.observacao}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openNotificationDialog(ticket)}
                      className="gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Notificar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Histórico
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum ticket encontrado com os filtros aplicados
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Notificação */}
      <Dialog open={isNotificationDialogOpen} onOpenChange={setIsNotificationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Enviar Notificação</DialogTitle>
            <div className="text-sm text-muted-foreground">
              Ticket: {selectedTicket?.numero} - {selectedTicket?.observacao?.substring(0, 50)}...
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destinatários *</Label>
              <div className="grid grid-cols-2 gap-2">
                {agentesDisponiveis.map(agente => (
                  <label key={agente} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={notificationData.destinatarios.includes(agente)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNotificationData({
                            ...notificationData,
                            destinatarios: [...notificationData.destinatarios, agente]
                          });
                        } else {
                          setNotificationData({
                            ...notificationData,
                            destinatarios: notificationData.destinatarios.filter(d => d !== agente)
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{agente}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Tipo de Notificação</Label>
              <Select value={notificationData.tipo} onValueChange={(value: any) => setNotificationData({ ...notificationData, tipo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Informativa</SelectItem>
                  <SelectItem value="warning">Atenção</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Mensagem *</Label>
              <Textarea
                value={notificationData.mensagem}
                onChange={(e) => setNotificationData({ ...notificationData, mensagem: e.target.value })}
                placeholder="Digite sua mensagem..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotificationDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendNotification} className="gap-2">
              <Send className="w-4 h-4" />
              Enviar Notificação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonitoringPortal;
