import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar,
  MessageSquare,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  MoreVertical
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Ticket {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  status: 'Pendente' | 'Em Andamento' | 'Aguardando' | 'Concluído';
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  quem_abriu: string;
  agente_saf: string;
  data_abertura: Date;
  data_vencimento: Date;
  data_conclusao?: Date;
  justificativa_conclusao?: string;
  observacoes: string;
  grupo: string;
  origem: string;
  pessoa_responsavel: string;
}

const TicketSystemSAF = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '1',
      numero: '#258209',
      titulo: 'Problema no domínio do CRM',
      descricao: 'Necessário configurar PC do CRM no domínio',
      status: 'Pendente',
      prioridade: 'Alta',
      quem_abriu: 'João Silva',
      agente_saf: 'Douglas Santos',
      data_abertura: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
      data_vencimento: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      observacoes: 'aguardando dados, para Douglas colocar no dominio o PC do CRM',
      grupo: 'TI',
      origem: 'E-mail',
      pessoa_responsavel: 'Douglas Santos'
    },
    {
      id: '2',
      numero: '#258809',
      titulo: 'Verificação EdTech',
      descricao: 'Caso sendo verificado pela equipe EdTech',
      status: 'Em Andamento',
      prioridade: 'Média',
      quem_abriu: 'João Silva',
      agente_saf: 'Fernanda Inacio',
      data_abertura: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
      data_vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      observacoes: 'esse caso quem está verificando é Fernanda Inacio de Edtech',
      grupo: 'EdTech',
      origem: 'Portal',
      pessoa_responsavel: 'Fernanda Inacio'
    },
    {
      id: '3',
      numero: '#259134',
      titulo: 'Tratamento com Iago',
      descricao: 'Caso sendo tratado com o Iago',
      status: 'Aguardando',
      prioridade: 'Crítica',
      quem_abriu: 'Tatiane Barbosa',
      agente_saf: 'Iago Mendes',
      data_abertura: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      data_vencimento: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      observacoes: 'Ainda sendo tratado deste caso com o Iago',
      grupo: 'SAF',
      origem: 'Telefone',
      pessoa_responsavel: 'Iago Mendes'
    },
    {
      id: '4',
      numero: '#258993',
      titulo: 'Aguardando retorno Eduardo',
      descricao: 'Pendente há 20 dias aguardando retorno',
      status: 'Aguardando',
      prioridade: 'Alta',
      quem_abriu: 'Ingrid Costa',
      agente_saf: 'Eduardo Lima',
      data_abertura: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      data_vencimento: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      observacoes: 'aguardando retorno do eduardo, há 20 dias pendente',
      grupo: 'Suporte',
      origem: 'Chat',
      pessoa_responsavel: 'Eduardo Lima'
    },
    {
      id: '5',
      numero: '#261211',
      titulo: 'Evidências recebidas',
      descricao: 'Evidências recebidas hoje, enviado para ClickUp',
      status: 'Em Andamento',
      prioridade: 'Baixa',
      quem_abriu: 'João Silva',
      agente_saf: 'Equipe Toddle',
      data_abertura: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      data_vencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      observacoes: 'recebemos evidencias hoje, enviado clickup toddle 261211',
      grupo: 'Toddle',
      origem: 'Portal',
      pessoa_responsavel: 'Equipe Toddle'
    },
    {
      id: '6',
      numero: '#262226',
      titulo: 'Resposta enviada',
      descricao: 'Resposta enviada, aguardando dados adicionais',
      status: 'Concluído',
      prioridade: 'Média',
      quem_abriu: 'João Silva',
      agente_saf: 'Suporte Geral',
      data_abertura: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      data_vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      data_conclusao: new Date(),
      justificativa_conclusao: 'Resposta enviada com sucesso, cliente satisfeito',
      observacoes: 'enviado resposta, aguardando dados',
      grupo: 'Suporte',
      origem: 'E-mail',
      pessoa_responsavel: 'Suporte Geral'
    }
  ]);

  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionJustification, setCompletionJustification] = useState("");

  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.quem_abriu.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.agente_saf.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter(ticket => ticket.prioridade === filterPriority);
    }

    setFilteredTickets(filtered);
  }, [searchTerm, filterStatus, filterPriority, tickets]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'destructive';
      case 'Em Andamento': return 'default';
      case 'Aguardando': return 'secondary';
      case 'Concluído': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'Crítica': return 'bg-red-100 text-red-800';
      case 'Alta': return 'bg-orange-100 text-orange-800';
      case 'Média': return 'bg-yellow-100 text-yellow-800';
      case 'Baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysOverdue = (vencimento: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isOverdue = (vencimento: Date) => {
    return new Date() > vencimento;
  };

  const isCritical = (ticket: Ticket) => {
    const daysOpen = Math.ceil((new Date().getTime() - ticket.data_abertura.getTime()) / (1000 * 60 * 60 * 24));
    return daysOpen > 15;
  };

  const handleCompleteTicket = (ticket: Ticket) => {
    if (!completionJustification.trim()) {
      toast.error("Justificativa é obrigatória para concluir o ticket");
      return;
    }

    const updatedTickets = tickets.map(t => 
      t.id === ticket.id 
        ? { 
            ...t, 
            status: 'Concluído' as const, 
            data_conclusao: new Date(),
            justificativa_conclusao: completionJustification
          }
        : t
    );
    
    setTickets(updatedTickets);
    setIsCompleteDialogOpen(false);
    setCompletionJustification("");
    setSelectedTicket(null);
    toast.success("Ticket concluído com sucesso!");
  };

  const criticalTickets = tickets.filter(ticket => isCritical(ticket) && ticket.status !== 'Concluído');
  const overdueTickets = tickets.filter(ticket => isOverdue(ticket.data_vencimento) && ticket.status !== 'Concluído');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Sistema de Tickets SAF
        </h1>
        <p className="text-muted-foreground">
          Gerencie seus tickets de atendimento com controle completo de prazos e justificativas
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tickets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalTickets.length}</div>
            <p className="text-xs text-muted-foreground">Mais de 15 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overdueTickets.length}</div>
            <p className="text-xs text-muted-foreground">Passaram do prazo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'Concluído').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e Ações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Criar Novo Ticket</DialogTitle>
                  <DialogDescription>
                    Preencha as informações do novo ticket de atendimento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Título do ticket" />
                  <Textarea placeholder="Descrição detalhada" />
                  <div className="grid grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baixa">Baixa</SelectItem>
                        <SelectItem value="Média">Média</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Crítica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Agente SAF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Douglas Santos">Douglas Santos</SelectItem>
                        <SelectItem value="Fernanda Inacio">Fernanda Inacio</SelectItem>
                        <SelectItem value="Iago Mendes">Iago Mendes</SelectItem>
                        <SelectItem value="Eduardo Lima">Eduardo Lima</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => {
                    toast.success("Ticket criado com sucesso!");
                    setIsCreateDialogOpen(false);
                  }}>
                    Criar Ticket
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, título, responsável..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Aguardando">Aguardando</SelectItem>
                <SelectItem value="Concluído">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Prioridades</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tickets */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className={`hover:shadow-md transition-shadow ${isCritical(ticket) ? 'border-red-200 bg-red-50/30' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-lg font-bold">{ticket.numero}</span>
                        <Badge variant={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.prioridade)}>
                          {ticket.prioridade}
                        </Badge>
                        {isCritical(ticket) && (
                          <Badge variant="destructive" className="animate-pulse">
                            CRÍTICO
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{ticket.titulo}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{ticket.descricao}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Aberto por:</strong> {ticket.quem_abriu}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Agente SAF:</strong> {ticket.agente_saf}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span><strong>Abertura:</strong> {ticket.data_abertura.toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className={`h-4 w-4 ${isOverdue(ticket.data_vencimento) ? 'text-red-500' : 'text-muted-foreground'}`} />
                      <span className={isOverdue(ticket.data_vencimento) ? 'text-red-600 font-medium' : ''}>
                        <strong>Vencimento:</strong> {ticket.data_vencimento.toLocaleDateString('pt-BR')}
                        {isOverdue(ticket.data_vencimento) && (
                          <span className="ml-1">({getDaysOverdue(ticket.data_vencimento)} dias atraso)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <strong>Observações:</strong> {ticket.observacoes}
                  </div>

                  {ticket.status === 'Concluído' && ticket.justificativa_conclusao && (
                    <div className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      <strong>Justificativa de Conclusão:</strong> {ticket.justificativa_conclusao}
                      {ticket.data_conclusao && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Concluído em: {ticket.data_conclusao.toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Edição em desenvolvimento")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    {ticket.status !== 'Concluído' && (
                      <DropdownMenuItem onClick={() => {
                        setSelectedTicket(ticket);
                        setIsCompleteDialogOpen(true);
                      }}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Concluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog para Conclusão */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Concluir Ticket</DialogTitle>
            <DialogDescription>
              Para concluir o ticket {selectedTicket?.numero}, é necessário fornecer uma justificativa.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Digite a justificativa para a conclusão do ticket..."
              value={completionJustification}
              onChange={(e) => setCompletionJustification(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCompleteDialogOpen(false);
              setCompletionJustification("");
            }}>
              Cancelar
            </Button>
            <Button onClick={() => selectedTicket && handleCompleteTicket(selectedTicket)}>
              Concluir Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredTickets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum ticket encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou criar um novo ticket.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketSystemSAF;
