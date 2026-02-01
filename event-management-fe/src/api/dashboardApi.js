import api from "./axios";

export const getOrganizerDashboard = (userId) => 
  api.get(`/dashboard/organizer/${userId}`);

export const getEventDetails = (eventId, userId) => 
  api.get(`/dashboard/event/${eventId}/details`, {
    params: { userId },
  });
