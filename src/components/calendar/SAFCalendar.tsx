import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, Clock, MapPin, Home, Briefcase, XCircle } from 'lucide-react';
import { format, parseISO, isSameDay, isWithinInterval, startOfWeek, endOfWeek, addDays, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  type: 'visita' | 'treinamento' | 'dayoff' | 'homeoffice' | 'outro';
  description: string;
  date: string; // ISO string
  time?: string; // HH:mm
  location?: string;
  responsible: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Visita à Escola Maple Bear Camaçari',
    type: 'visita',
    description: 'Reunião com a direção para alinhamento estratégico.',
    date: '2025-09-25',
    time: '10:00',
    location: 'Camaçari, BA',
    responsible: 'Ana Silva',
  },
  {
    id: '2',
    title: 'Treinamento Toddle para Agentes SAF',
    type: 'treinamento',
    description: 'Sessão de capacitação sobre novas funcionalidades do Toddle.',
    date: '2025-09-28',
    time: '14:00',
    location: 'Online',
    responsible: 'João Pedro',
  },
  {
    id: '3',
    title: 'Day Off - Feriado',
    type: 'dayoff',
    description: 'Feriado nacional.',
    date: '2025-09-07',
    responsible: 'Todos',
  },
  {
    id: '4',
    title: 'Home Office - Desenvolvimento de Projeto X',
    type: 'homeoffice',
    description: 'Foco no desenvolvimento do novo módulo do sistema.',
    date: '2025-09-26',
    responsible: 'Maria Souza',
  },
  {
    id: '5',
    title: 'Reunião de Alinhamento Semanal',
    type: 'outro',
    description: 'Reunião de equipe para discutir o progresso dos projetos.',
    date: '2025-09-24',
    time: '09:00',
    location: 'Sala de Reuniões',
    responsible: 'Ana Silva',
  },
];

const SAFCalendar = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    type: 'outro',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    responsible: '',
  });
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const daysInMonth = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = [];
    let day = start;
    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const startDay = startOfWeek(startOfMonth(currentMonth), { locale: ptBR });
  const endDay = endOfWeek(endOfMonth(currentMonth), { locale: ptBR });
  const calendarDays = [];
  let day = startDay;

  while (day <= endDay) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.responsible) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios (Título, Data, Responsável).',
        variant: 'destructive',
      });
      return;
    }

    const eventToAdd: Event = {
      ...newEvent,
      id: Date.now().toString(),
    };

    setEvents((prev) => [...prev, eventToAdd]);
    setNewEvent({
      title: '',
      type: 'outro',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      responsible: '',
    });
    setIsAddEventDialogOpen(false);
    toast({
      title: 'Sucesso',
      description: 'Evento adicionado à agenda!',
    });
  };

  const handleEditEvent = () => {
    if (!editingEvent || !editingEvent.title || !editingEvent.date || !editingEvent.responsible) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios (Título, Data, Responsável).',
        variant: 'destructive',
      });
      return;
    }

    setEvents((prev) =>
      prev.map((evt) => (evt.id === editingEvent.id ? editingEvent : evt))
    );
    setEditingEvent(null);
    setIsEditEventDialogOpen(false);
    toast({
      title: 'Sucesso',
      description: 'Evento atualizado na agenda!',
    });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    toast({
      title: 'Sucesso',
      description: 'Evento removido da agenda!',
    });
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'visita': return <MapPin className="w-3 h-3 text-blue-500" />;
      case 'treinamento': return <Briefcase className="w-3 h-3 text-green-500" />;
      case 'dayoff': return <XCircle className="w-3 h-3 text-red-500" />;
      case 'homeoffice': return <Home className="w-3 h-3 text-purple-500" />;
      default: return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Agenda do Time SAF
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Gerencie eventos, visitas, treinamentos e compromissos da equipe SAF.
          </p>
        </div>
        <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Evento</DialogTitle>
              <DialogDescription>Preencha os detalhes do evento para adicionar à agenda.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Título</Label>
                <Input id="title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Tipo</Label>
                <Select value={newEvent.type} onValueChange={(value: Event['type']) => setNewEvent({ ...newEvent, type: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visita">Visita em Escola</SelectItem>
                    <SelectItem value="treinamento">Treinamento</SelectItem>
                    <SelectItem value="dayoff">Day Off</SelectItem>
                    <SelectItem value="homeoffice">Home Office</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descrição</Label>
                <Textarea id="description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">Data</Label>
                <Input type="date" id="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="time" className="text-right">Hora (opcional)</Label>
                <Input type="time" id="time" value={newEvent.time || ''} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Local (opcional)</Label>
                <Input id="location" value={newEvent.location || ''} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible" className="text-right">Responsável</Label>
                <Input id="responsible" value={newEvent.responsible} onChange={(e) => setNewEvent({ ...newEvent, responsible: e.target.value })} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddEvent}>Adicionar Evento</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Mês Anterior</Button>
          <CardTitle>{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</CardTitle>
          <Button variant="ghost" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Próximo Mês</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 text-center font-bold text-sm text-muted-foreground mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dayEvents = events.filter((event) => isSameDay(parseISO(event.date), day));
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={index}
                  className={`p-2 rounded-md h-28 border flex flex-col overflow-hidden
                    ${isCurrentMonth ? 'bg-card' : 'bg-muted/40 text-muted-foreground'}
                    ${isToday ? 'border-primary ring-2 ring-primary/50' : 'border-border'}
                    ${selectedDate && isSameDay(day, selectedDate) ? 'bg-primary/10' : ''}
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={`text-sm font-semibold ${!isCurrentMonth ? 'text-muted-foreground' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="flex-grow overflow-y-auto space-y-1 mt-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`flex items-center gap-1 text-xs p-1 rounded-sm
                          ${event.type === 'visita' ? 'bg-blue-100 text-blue-800' :
                            event.type === 'treinamento' ? 'bg-green-100 text-green-800' :
                            event.type === 'dayoff' ? 'bg-red-100 text-red-800' :
                            event.type === 'homeoffice' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingEvent(event);
                          setIsEditEventDialogOpen(true);
                        }}
                      >
                        {getEventIcon(event.type)}
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Details / Edit Dialog */}
      <Dialog open={isEditEventDialogOpen} onOpenChange={setIsEditEventDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento</DialogTitle>
            <DialogDescription>Visualize ou edite os detalhes do evento.</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">Título</Label>
                <Input id="edit-title" value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">Tipo</Label>
                <Select value={editingEvent.type} onValueChange={(value: Event['type']) => setEditingEvent({ ...editingEvent, type: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visita">Visita em Escola</SelectItem>
                    <SelectItem value="treinamento">Treinamento</SelectItem>
                    <SelectItem value="dayoff">Day Off</SelectItem>
                    <SelectItem value="homeoffice">Home Office</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Descrição</Label>
                <Textarea id="edit-description" value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">Data</Label>
                <Input type="date" id="edit-date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">Hora (opcional)</Label>
                <Input type="time" id="edit-time" value={editingEvent.time || ''} onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">Local (opcional)</Label>
                <Input id="edit-location" value={editingEvent.location || ''} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-responsible" className="text-right">Responsável</Label>
                <Input id="edit-responsible" value={editingEvent.responsible} onChange={(e) => setEditingEvent({ ...editingEvent, responsible: e.target.value })} className="col-span-3" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEventDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => editingEvent && handleDeleteEvent(editingEvent.id)}>Excluir</Button>
            <Button onClick={handleEditEvent}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SAFCalendar;
