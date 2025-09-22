import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  AlertTriangle,
  MessageSquare,
  Filter,
  Download
} from 'lucide-react';
import { useCoordinatorStore } from '@/stores/coordinatorStore';
import { useTicketStore } from '@/stores/ticketStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

const CoordinatorDashboard = () => {
  const [selectedTicketForEvaluation, setSelectedTicketForEvaluation] = useState<string | null>(null);
  const [evaluationRating, setEvaluationRating] = useState(5);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'unread'>('unread');

  const { 
    notifications, 
    createNotification, 
    markNotificationAsRead, 
    getUnreadNotifications,
    createEvaluation,
    getTeamPerformanceMetrics 
  } = useCoordinatorStore();

  const { 
    tickets, 
    updateTicket, 
    getCriticalTickets, 
    getOverdueTickets 
  } = useTicketStore();

  const { currentUser, hasRole } = useAuthStore();

  // Redirect if not coordinator
  if (!hasRole('Coordinator')) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground">
              Este dashboard é exclusivo para coordenadores.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const unreadNotifications = getUnreadNotifications();
  const criticalTickets = getCriticalTickets();
  const overdueTickets = getOverdueTickets();
  const teamMetrics = getTeamPerformanceMetrics();

  const filteredNotifications = notificationFilter === 'unread' 
    ? unreadNotifications 
    : notifications;

  const handleApproveTicket = (ticketId: string) => {
    updateTicket(ticketId, { 
      status: 'Aprovado',
      needsApproval: false 
    });
    
    // Mark related notifications as read
    notifications
      .filter(n => n.ticketId === ticketId && n.type === 'approval_needed')
      .forEach(n => markNotificationAsRead(n.id));

    toast.success('Ticket aprovado com sucesso');
  };

  const handleRejectTicket = (ticketId: string) => {
    updateTicket(ticketId, { 
      status: 'Rejeitado',
      needsApproval: false 
    });
    
    // Mark related notifications as read
    notifications
      .filter(n => n.ticketId === ticketId && n.type === 'approval_needed')
      .forEach(n => markNotificationAsRead(n.id));

    toast.success('Ticket rejeitado');
  };

  const handleEvaluateTicket = () => {
    if (!selectedTicketForEvaluation || !currentUser) return;

    const ticket = tickets.find(t => t.id === selectedTicketForEvaluation);
    if (!ticket) return;

    createEvaluation({
      ticketId: selectedTicketForEvaluation,
      evaluatorId: currentUser.id,
      evaluatorName: currentUser.name,
      rating: evaluationRating,
      feedback: evaluationFeedback
    });

    updateTicket(selectedTicketForEvaluation, {
      evaluationId: Date.now().toString()
    });

    toast.success(`Avaliação registrada para ${ticket.agente}`);
    
    // Reset form
    setSelectedTicketForEvaluation(null);
    setEvaluationRating(5);
    setEvaluationFeedback('');
  };

  const createTestNotifications = () => {
    // Create some test notifications
    createNotification({
      type: 'approval_needed',
      title: 'Aprovação Necessária',
      message: 'Ticket #258209 precisa de aprovação',
      ticketId: '#258209',
      targetRole: ['Coordinator']
    });

    createNotification({
      type: 'overdue',
      title: 'Ticket Vencido',
      message: 'Ticket #259134 está vencido há 2 dias',
      ticketId: '#259134',
      targetRole: ['Coordinator']
    });

    toast.success('Notificações de teste criadas');
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            Dashboard da Coordenadora
          </h1>
          <p className="text-muted-foreground">
            Bem-vinda, {currentUser?.name}. Monitore e gerencie a equipe SAF.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={createTestNotifications}>
            <Bell className="h-4 w-4 mr-2" />
            Criar Notificações Teste
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Relatório Geral
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {teamMetrics.pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueTickets.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Passaram do prazo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {teamMetrics.averageRating.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Nota da equipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
            <Bell className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {unreadNotifications.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Não lidas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <Select value={notificationFilter} onValueChange={(value: 'all' | 'unread') => setNotificationFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unread">Não lidas</SelectItem>
                  <SelectItem value="all">Todas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma notificação</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${
                    notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {notification.type === 'approval_needed' && notification.ticketId && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleApproveTicket(notification.ticketId!)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectTicket(notification.ticketId!)}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance da Equipe
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMetrics.agentMetrics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma avaliação registrada</p>
              </div>
            ) : (
              teamMetrics.agentMetrics.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{agent.agent}</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.ticketsHandled} tickets • {agent.pendingTickets} pendentes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{agent.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Critical Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Tickets Críticos e Vencidos
          </CardTitle>
          <CardDescription>
            Tickets que precisam de atenção imediata
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...overdueTickets, ...criticalTickets.filter(t => !overdueTickets.find(ot => ot.id === t.id))].map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold">{ticket.id}</span>
                    <Badge variant={overdueTickets.find(t => t.id === ticket.id) ? 'destructive' : 'secondary'}>
                      {overdueTickets.find(t => t.id === ticket.id) ? 'Vencido' : 'Crítico'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {ticket.agente} • {ticket.diasAberto} dias aberto
                  </p>
                  <p className="text-sm mt-1">{ticket.observacao}</p>
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTicketForEvaluation(ticket.id)}
                      >
                        <Star className="h-4 w-4 mr-1" />
                        Avaliar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Avaliar Atendimento</DialogTitle>
                        <DialogDescription>
                          Avalie o atendimento do ticket {ticket.id} por {ticket.agente}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Nota (1-5)</label>
                          <Select value={evaluationRating.toString()} onValueChange={(value) => setEvaluationRating(parseInt(value))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 - Muito Ruim</SelectItem>
                              <SelectItem value="2">2 - Ruim</SelectItem>
                              <SelectItem value="3">3 - Regular</SelectItem>
                              <SelectItem value="4">4 - Bom</SelectItem>
                              <SelectItem value="5">5 - Excelente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">Feedback</label>
                          <Textarea
                            value={evaluationFeedback}
                            onChange={(e) => setEvaluationFeedback(e.target.value)}
                            placeholder="Comentários sobre o atendimento..."
                            rows={3}
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedTicketForEvaluation(null)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleEvaluateTicket}>
                          Salvar Avaliação
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
            
            {[...overdueTickets, ...criticalTickets].length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500 opacity-50" />
                <p>Nenhum ticket crítico ou vencido!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoordinatorDashboard;



      {/* Canva License Control Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-500" />
              Controle de Licenças Canva
            </CardTitle>
            <CardDescription>
              Visão geral das licenças Canva por escola
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Canva Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Licenças Pagas</span>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-blue-600">815</p>
                <p className="text-xs text-blue-600">Total contratado 2025</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Em Uso</span>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-green-600">342</p>
                <p className="text-xs text-green-600">42% de utilização</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => window.location.href = '/dashboard/canva-licenses'}
              >
                <Building className="h-4 w-4" />
                Ver Todas as Escolas
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={() => toast.info('Funcionalidade em desenvolvimento')}
              >
                <UserX className="h-4 w-4" />
                Usuários com Domínio Inválido (12)
              </Button>
            </div>

            {/* License Alerts */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Alertas de Licenças</h4>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Excesso de Licenças</p>
                    <p className="text-xs text-red-600">
                      Maple Bear Goiânia - Marista II está usando 8/6 licenças
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Revisão Necessária</p>
                    <p className="text-xs text-orange-600">
                      5 escolas com usuários de domínios não corporativos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Escolas com Mais Licenças
            </CardTitle>
            <CardDescription>
              Top 5 escolas por uso de licenças Canva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Maple Bear Goiânia - Marista II', used: 8, total: 6, status: 'excess' },
                { name: 'Maple Bear São Roque', used: 5, total: 5, status: 'full' },
                { name: 'Maple Bear Primavera Do Leste', used: 4, total: 5, status: 'normal' },
                { name: 'Maple Bear Arcoverde', used: 3, total: 3, status: 'full' },
                { name: 'Maple Bear Pindamonhangaba', used: 2, total: 3, status: 'normal' }
              ].map((school, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{school.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {school.used}/{school.total} licenças
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(school.used / school.total) * 100} 
                      className="w-16 h-2"
                    />
                    <Badge 
                      variant={
                        school.status === 'excess' ? 'destructive' : 
                        school.status === 'full' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {school.status === 'excess' ? 'Excesso' : 
                       school.status === 'full' ? 'Completo' : 'Normal'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/dashboard/canva-licenses'}
            >
              Ver Relatório Completo
            </Button>
          </CardContent>
        </Card>
      </div>

