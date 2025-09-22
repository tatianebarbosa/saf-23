import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Filter, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Table,
  Kanban,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { useAuthStore } from '@/stores/authStore';
import { TicketKanban } from '@/components/tickets/TicketKanban';
import { TicketTable } from '@/components/tickets/TicketTable';
import { TicketDialog } from '@/components/tickets/TicketDialog';
import AddTicketForm from '@/components/tickets/AddTicketForm';
import { TicketStatus, Agente } from '@/types/tickets';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

const TicketsPage = () => {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  
  const { tickets, addTicket } = useTickets();
  const { hasRole } = useAuthStore();
  const navigate = useNavigate();
  
  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticketNumber.includes(searchTerm) || 
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesAgent = agentFilter === 'all' || ticket.agent.shortName === agentFilter;
    
    return matchesSearch && matchesStatus && matchesAgent;
  });
  
  const stats = {
    total: filteredTickets.length,
    pendente: filteredTickets.filter(t => t.status === 'Pendente').length,
    emAndamento: filteredTickets.filter(t => t.status === 'Em Andamento').length,
    resolvido: filteredTickets.filter(t => t.status === 'Resolvido').length,
  };

  const handleAddTicket = (ticketData: any) => {
    addTicket(ticketData);
    setIsAdding(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      
      switch (e.key.toLowerCase()) {
        case 'n':
          setIsAdding(true);
          break;
        case 'k':
          setView('kanban');
          break;
        case 't':
          setView('table');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const agentes: string[] = ['Tatiane', 'Rafhael', 'Ingrid', 'João', 'Jaque', 'Jéssica', 'Fernanda'];

  if (isAdding) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <AddTicketForm 
          onClose={() => setIsAdding(false)} 
          onSubmit={handleAddTicket} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tickets SAF</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Gerencie seus tickets de atendimento
          </p>
        </div>
        
        <Button onClick={() => setIsAdding(true)} className="gap-2 bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4" />
          Novo Ticket
        </Button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID ou observação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        <div className="flex gap-2">
          <Select 
            value={agentFilter} 
            onValueChange={setAgentFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os agentes</SelectItem>
              {agentes.map((agente) => (
                <SelectItem key={agente} value={agente}>{agente}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={view === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('kanban')}
            className="gap-2"
          >
            <Kanban className="h-4 w-4" />
            Kanban
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
            className="gap-2"
          >
            <Table className="h-4 w-4" />
            Tabela
          </Button>
        </div>
      </div>

      {/* Stats Badges - More compact */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="secondary" className="text-sm px-3 py-1">Total: {stats.total}</Badge>
        <Badge className="bg-orange-500 text-white text-sm px-3 py-1">Pendente: {stats.pendente}</Badge>
        <Badge className="bg-blue-500 text-white text-sm px-3 py-1">Em Andamento: {stats.emAndamento}</Badge>
        <Badge className="bg-green-500 text-white text-sm px-3 py-1">Resolvido: {stats.resolvido}</Badge>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {view === 'kanban' ? (
          <TicketKanban tickets={filteredTickets} />
        ) : (
          <TicketTable tickets={filteredTickets} />
        )}
      </div>

      {/* Keyboard shortcuts info */}
      <div className="text-xs text-muted-foreground">
        <span className="font-medium">Atalhos:</span> N (novo) • K (kanban) • T (tabela)
      </div>
    </div>
  );
};

export default TicketsPage;