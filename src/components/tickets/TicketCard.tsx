import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Ticket } from '@/types/tickets';
import { format, differenceInDays } from 'date-fns';
import { MoreVertical, Edit, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTicketStore } from '@/stores/ticketStore';

interface TicketCardProps {
  ticket: Ticket;
  canManage: boolean;
}

export const TicketCard = ({ ticket, canManage }: TicketCardProps) => {
  const { moveTicket } = useTicketStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getSLABadge = () => {
    if (ticket.diasAberto >= 15) {
      return <Badge variant="destructive" className="text-xs">Crítico {ticket.diasAberto}d</Badge>;
    }
    if (ticket.diasAberto >= 8) {
      return <Badge className="text-xs bg-orange-100 text-orange-800">Atenção {ticket.diasAberto}d</Badge>;
    }
    return <Badge variant="outline" className="text-xs">{ticket.diasAberto}d</Badge>;
  };

  const getDueDateBadge = () => {
    if (!ticket.dueDate) return null;
    
    const now = new Date();
    const due = new Date(ticket.dueDate);
    const diffDays = differenceInDays(due, now);
    
    if (diffDays < 0) {
      return <Badge variant="destructive" className="text-xs">Atraso {Math.abs(diffDays)}d</Badge>;
    }
    if (diffDays === 0) {
      return <Badge className="text-xs bg-yellow-100 text-yellow-800">Vence hoje</Badge>;
    }
    if (diffDays <= 3) {
      return <Badge className="text-xs bg-blue-100 text-blue-800">Vence em {diffDays}d</Badge>;
    }
    
    return null;
  };

  const handleResolve = () => {
    moveTicket(ticket.id, 'Resolvido');
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      } ${canManage ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      {...(canManage ? { ...attributes, ...listeners } : {})}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-gray-800 dark:text-gray-200">#{ticket.ticketNumber}</span>
          <div className="flex items-center gap-1">
            {getSLABadge()}
            {getDueDateBadge()}
            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-3 w-3 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {ticket.status !== 'Resolvido' && (
                    <DropdownMenuItem onClick={handleResolve}>
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Resolver
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
          {ticket.observacao}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 border-2 border-gray-200 dark:border-gray-700">
              <AvatarFallback className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-bold">
                {ticket.agente.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-600 dark:text-gray-400">{ticket.agente}</span>
          </div>
          <span className="text-gray-500 dark:text-gray-400">{format(new Date(ticket.updatedAt), 'dd/MM')}</span>
        </div>
        
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {ticket.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};