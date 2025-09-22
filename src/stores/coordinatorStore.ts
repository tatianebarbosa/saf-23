import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TicketEvaluation, Notification, Ticket } from '@/types/tickets';

interface CoordinatorStore {
  evaluations: TicketEvaluation[];
  notifications: Notification[];
  
  // Actions for evaluations
  createEvaluation: (evaluation: Omit<TicketEvaluation, 'id' | 'createdAt'>) => void;
  updateEvaluation: (id: string, updates: Partial<TicketEvaluation>) => void;
  getEvaluationByTicketId: (ticketId: string) => TicketEvaluation | undefined;
  getEvaluationsByAgent: (agentName: string) => TicketEvaluation[];
  
  // Actions for notifications
  createNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: Notification['type']) => Notification[];
  clearOldNotifications: () => void;
  
  // Dashboard metrics
  getTeamPerformanceMetrics: () => {
    totalTickets: number;
    averageRating: number;
    pendingApprovals: number;
    overdueTickets: number;
    agentMetrics: Array<{
      agent: string;
      ticketsHandled: number;
      averageRating: number;
      pendingTickets: number;
    }>;
  };
}

export const useCoordinatorStore = create<CoordinatorStore>()(
  persist(
    (set, get) => ({
      evaluations: [],
      notifications: [],

      createEvaluation: (evaluationData) => {
        const newEvaluation: TicketEvaluation = {
          ...evaluationData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          evaluations: [...state.evaluations, newEvaluation]
        }));
      },

      updateEvaluation: (id, updates) => {
        set((state) => ({
          evaluations: state.evaluations.map((evaluation) =>
            evaluation.id === id ? { ...evaluation, ...updates } : evaluation
          )
        }));
      },

      getEvaluationByTicketId: (ticketId) => {
        return get().evaluations.find(evaluation => evaluation.ticketId === ticketId);
      },

      getEvaluationsByAgent: (agentName) => {
        return get().evaluations.filter(evaluation => {
          // Aqui você pode implementar lógica para associar avaliações aos agentes
          // Por enquanto, vamos usar uma busca simples
          return evaluation.evaluatorName === agentName;
        });
      },

      createNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          isRead: false
        };
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
          )
        }));
      },

      getUnreadNotifications: () => {
        return get().notifications.filter(notification => !notification.isRead);
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter(notification => notification.type === type);
      },

      clearOldNotifications: () => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        set((state) => ({
          notifications: state.notifications.filter(notification => 
            new Date(notification.createdAt) > thirtyDaysAgo
          )
        }));
      },

      getTeamPerformanceMetrics: () => {
        const { evaluations } = get();
        
        // Métricas básicas - você pode expandir isso com dados reais dos tickets
        const totalTickets = evaluations.length;
        const averageRating = evaluations.length > 0 
          ? evaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0) / evaluations.length 
          : 0;
        
        // Agrupa avaliações por agente
        const agentMetrics = evaluations.reduce((acc, evaluation) => {
          const existing = acc.find(a => a.agent === evaluation.evaluatorName);
          if (existing) {
            existing.ticketsHandled += 1;
            existing.averageRating = (existing.averageRating + evaluation.rating) / 2;
          } else {
            acc.push({
              agent: evaluation.evaluatorName,
              ticketsHandled: 1,
              averageRating: evaluation.rating,
              pendingTickets: 0 // Isso seria calculado com base nos tickets reais
            });
          }
          return acc;
        }, [] as Array<{
          agent: string;
          ticketsHandled: number;
          averageRating: number;
          pendingTickets: number;
        }>);

        return {
          totalTickets,
          averageRating,
          pendingApprovals: get().notifications.filter(n => n.type === 'approval_needed' && !n.isRead).length,
          overdueTickets: get().notifications.filter(n => n.type === 'overdue' && !n.isRead).length,
          agentMetrics
        };
      }
    }),
    {
      name: 'saf-coordinator-storage'
    }
  )
);

