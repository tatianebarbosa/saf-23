import { Ticket } from "@/types/tickets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList = ({ tickets }: TicketListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Nenhum ticket encontrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              #{ticket.ticketNumber}
            </CardTitle>
            <Badge 
              variant={ticket.status === "Pendente" ? "destructive" : ticket.status === "Resolvido" ? "success" : "default"}
            >
              {ticket.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p><strong>Agente:</strong> {ticket.agent.shortName}</p>
            <p><strong>Descrição:</strong> {ticket.description}</p>
            <p><strong>Aberto em:</strong> {formatDistanceToNow(parseISO(ticket.createdAt), { addSuffix: true, locale: ptBR })}</p>
            <p><strong>Pendente há:</strong> {formatDistanceToNow(parseISO(ticket.pendingDate), { addSuffix: true, locale: ptBR })}</p>
            <p><strong>Prazo de Retorno:</strong> {formatDistanceToNow(parseISO(ticket.returnDeadline), { addSuffix: true, locale: ptBR })}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TicketList;

