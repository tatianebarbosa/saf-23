export type TicketStatus = 'Pendente' | 'Em andamento' | 'Resolvido' | 'Aprovado' | 'Rejeitado';
export type Agente = 'RAFHAEL NAZEAZENO PEREIRA' | 'INGRID VANIA MAZZEI DE OLIVEIRA' | 'Joao Felipe Gutierrez de Freitas' | 'ANA PAULA OLIVEIRA DE ANDRADE' | 'TATIANE BARBOSA DOS SANTOS XAVIER';
export type Role = 'Agent' | 'Coordinator' | 'Admin';

export interface TicketEvaluation {
  id: string;
  ticketId: string;
  evaluatorId: string;
  evaluatorName: string;
  rating: number; // 1-5
  feedback: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'approval_needed' | 'overdue' | 'critical' | 'evaluation_request';
  title: string;
  message: string;
  ticketId?: string;
  isRead: boolean;
  createdAt: string;
  targetRole: Role[];
}

export interface Ticket {
  id: string;              // "#258209"
  agente: Agente;          // responsável atual
  diasAberto: number;      // p/ badge de SLA
  status: TicketStatus;
  observacao: string;
  createdAt: string;       // ISO
  updatedAt: string;       // ISO
  dueDate?: string;        // ISO (vencimento)
  watchers?: (Agente | 'Coordinator' | 'Admin')[]; // quem recebe alerta
  tags?: string[];
  needsApproval?: boolean; // se precisa de aprovação da coordenadora
  evaluationId?: string;   // ID da avaliação, se houver
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  agente?: Agente;
  username?: string;
  password?: string;
}

export interface SiteConfig {
  title: string;
  menus: {
    name: string;
    url: string;
  }[];
}