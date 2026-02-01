import api from "./axios";

export const bookTicket = (bookingData, userId) =>
  api.post("/tickets/book", {
    ...bookingData,
    userId,
  });

export const confirmTicket = (ticketId) =>
  api.post(`/tickets/confirm/${ticketId}`);

export const getUserTickets = (userId) => api.get(`/tickets/user/${userId}`);
