import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SAF_AGENTS, TICKET_SOURCES, TICKET_GROUPS } from "@/data/agents";
import { useToast } from "@/hooks/use-toast";

interface AddTicketFormProps {
  onClose: () => void;
  onSubmit: (ticketData: any) => void;
}

const AddTicketForm = ({ onClose, onSubmit }: AddTicketFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ticketNumber: "",
    status: "Pendente",
    source: "",
    group: "",
    personnel: "",
    pendingDate: new Date(),
    returnDeadline: new Date(),
    description: "",
    requester: "",
    agent: ""
  });

  const [pendingDate, setPendingDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ticketNumber || !formData.source || !formData.group || !formData.agent) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const ticketData = {
      ...formData,
      pendingDate: pendingDate || new Date(),
      returnDeadline: returnDate || new Date(),
      id: `ticket-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSubmit(ticketData);
    
    toast({
      title: "Ticket criado",
      description: `Ticket #${formData.ticketNumber} foi criado com sucesso`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Ticket</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Informações do Ticket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Linha 1: Número do Ticket e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticketNumber">Número do Ticket *</Label>
                <Input
                  id="ticketNumber"
                  placeholder="Ex: #258209"
                  value={formData.ticketNumber}
                  onChange={(e) => setFormData({ ...formData, ticketNumber: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Resolvido">Resolvido</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 2: Onde foi aberto e Grupo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Onde foi aberto o chamado *</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a origem" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group">Grupo *</Label>
                <Select value={formData.group} onValueChange={(value) => setFormData({ ...formData, group: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_GROUPS.map((group) => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 3: Pessoal e Agente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="personnel">Pessoal Responsável</Label>
                <Input
                  id="personnel"
                  placeholder="Nome da pessoa responsável"
                  value={formData.personnel}
                  onChange={(e) => setFormData({ ...formData, personnel: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="agent">Agente SAF *</Label>
                <Select value={formData.agent} onValueChange={(value) => setFormData({ ...formData, agent: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o agente" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAF_AGENTS.filter(agent => !agent.isCoordinator).map((agent) => (
                      <SelectItem key={agent.id} value={agent.shortName}>{agent.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 4: Datas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data que colocou no pendente</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {pendingDate ? format(pendingDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={pendingDate}
                      onSelect={setPendingDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Prazo de retorno do time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? format(returnDate, "PPP", { locale: ptBR }) : "Selecione a data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Linha 5: Quem abriu o chamado */}
            <div className="space-y-2">
              <Label htmlFor="requester">Quem abriu o chamado</Label>
              <Input
                id="requester"
                placeholder="Nome de quem solicitou o ticket"
                value={formData.requester}
                onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
              />
            </div>

            {/* Linha 6: Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do chamado</Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente o problema ou solicitação..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Ticket
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTicketForm;

