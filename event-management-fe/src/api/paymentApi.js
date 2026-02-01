import api from "./axios";

export const createOrder = (userId, eventId, amount) =>
  api.post("/payment/create-order", { userId, eventId, amount });

export const verifyPayment = (data) => api.post("/payment/verify", data);
