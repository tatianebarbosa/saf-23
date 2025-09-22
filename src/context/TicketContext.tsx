import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Ticket } from '@/types/tickets';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (newTicket: Ticket) => void;
  updateTicket: (updatedTicket: Ticket) => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const addTicket = (newTicket: Ticket) => {
    setTickets((prevTickets) => [...prevTickets, newTicket]);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

