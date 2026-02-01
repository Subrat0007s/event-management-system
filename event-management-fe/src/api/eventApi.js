import api from "./axios";

export const getAllEvents = () => api.get("/events/all");

export const getPublicEvents = () => api.get("/events/public");

export const searchEvents = (keyword) =>
  api.get("/events/search", {
    params: { keyword },
  });

export const getEventsWithFilters = (filters) =>
  api.get("/events/filter", {
    params: filters,
  });

export const getEventsByCategory = (category) =>
  api.get(`/events/category/${category}`);

export const createEvent = (data, userId) =>
  api.post("/events/create", data, {
    params: { userId },
  });

export const updateEvent = (eventId, creatorId, data) =>
  api.put("/events/update", data, {
    params: { eventId, creatorId },
  });

export const deleteEvent = (eventId, userId) =>
  api.delete("/events/delete", {
    params: { eventId, userId },
  });

export const getEventBookings = (eventId, creatorId) =>
  api.get("/events/bookings", {
    params: { eventId, creatorId },
  });

export const getMyEvents = (userId) =>
  api.get("/events/my-events", {
    params: { userId },
    timeout: 10000, // 10 second timeout
  });

export const getEventDetails = (eventId) =>
  api.get("/events/details", {
    params: { eventId },
  });
