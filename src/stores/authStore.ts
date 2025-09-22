import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role, Agente } from '@/types/tickets';

interface AuthStore {
  currentUser: User | null;
  users: User[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  createUser: (userData: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  removeUser: (id: string) => void;
  login: (username: string, password: string) => User | null;
  logout: () => void;
  
  // Auth helpers
  hasRole: (role: Role) => boolean;
  canManageTicket: (ticketAgente: Agente) => boolean;
  isAgent: () => boolean;
  isCoordinator: () => boolean;
  isAdmin: () => boolean;
}

// Initial seed users with login credentials
const seedUsers: User[] = [
  { 
    id: '1', 
    name: 'RAFHAEL NAZEAZENO PEREIRA', 
    email: 'rafhael@maplebear.com.br', 
    role: 'Agent', 
    agente: 'RAFHAEL NAZEAZENO PEREIRA',
    username: 'rafhael.pereira',
    password: 'maple2024'
  },
  { 
    id: '2', 
    name: 'INGRID VANIA MAZZEI DE OLIVEIRA', 
    email: 'ingrid@maplebear.com.br', 
    role: 'Agent', 
    agente: 'INGRID VANIA MAZZEI DE OLIVEIRA',
    username: 'ingrid.oliveira',
    password: 'maple2024'
  },
  { 
    id: '3', 
    name: 'Joao Felipe Gutierrez de Freitas', 
    email: 'joao@maplebear.com.br', 
    role: 'Agent', 
    agente: 'Joao Felipe Gutierrez de Freitas',
    username: 'joao.freitas',
    password: 'maple2024'
  },
  { 
    id: '4', 
    name: 'ANA PAULA OLIVEIRA DE ANDRADE', 
    email: 'ana.paula@maplebear.com.br', 
    role: 'Coordinator', 
    agente: 'ANA PAULA OLIVEIRA DE ANDRADE',
    username: 'ana.paula',
    password: 'coord2024'
  },
  { 
    id: '5', 
    name: 'TATIANE BARBOSA DOS SANTOS XAVIER', 
    email: 'tatiane@maplebear.com.br', 
    role: 'Agent', 
    agente: 'TATIANE BARBOSA DOS SANTOS XAVIER',
    username: 'tatiane.xavier',
    password: 'maple2024'
  },
  { 
    id: '6', 
    name: 'Admin Sistema', 
    email: 'admin@maplebear.com.br', 
    role: 'Admin',
    username: 'admin',
    password: 'admin2024'
  }
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      setUsers: (users) => set({ users }),

      createUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString()
        };
        
        set((state) => ({
          users: [...state.users, newUser]
        }));
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          )
        }));
      },

      removeUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id)
        }));
      },

      login: (username, password) => {
        const { users } = get();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          set({ currentUser: user });
          return user;
        }
        return null;
      },

      logout: () => {
        set({ currentUser: null });
      },

      hasRole: (role) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        // Admin has all permissions
        if (currentUser.role === 'Admin') return true;
        
        // Coordinator has Agent + Coordinator permissions
        if (currentUser.role === 'Coordinator' && (role === 'Agent' || role === 'Coordinator')) return true;
        
        return currentUser.role === role;
      },

      canManageTicket: (ticketAgente) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        
        // Admin and Coordinator can manage any ticket
        if (currentUser.role === 'Admin' || currentUser.role === 'Coordinator') return true;
        
        // Agent can only manage their own tickets
        return currentUser.role === 'Agent' && currentUser.agente === ticketAgente;
      },

      isAgent: () => get().currentUser?.role === 'Agent',
      isCoordinator: () => get().currentUser?.role === 'Coordinator',
      isAdmin: () => get().currentUser?.role === 'Admin'
    }),
    {
      name: 'saf-auth-storage',
      onRehydrateStorage: () => (state) => {
        // Always initialize with seed data to ensure users are available
        if (state) {
          state.setUsers(seedUsers);
        }
      }
    }
  )
);