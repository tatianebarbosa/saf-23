import { MOCK_TICKETS as MOCK_TICKETS_DEV } from "./mockTickets";

export const MOCK_TICKETS = import.meta.env.PROD ? [] : MOCK_TICKETS_DEV;

