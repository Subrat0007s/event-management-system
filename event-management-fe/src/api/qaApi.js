import api from "./axios";

export const askQuestion = (userId, eventId, question) =>
  api.post("/qa/ask", {
    userId,
    eventId,
    question,
  });

export const answerQuestion = (qaId, creatorId, answer) =>
  api.post("/qa/answer", {
    qaId,
    creatorId,
    answer,
  });

export const viewQuestions = (eventId) => api.get(`/qa/view/${eventId}`);
