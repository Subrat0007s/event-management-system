import api from "./axios";

export const createPoll = (data) => api.post("/polls/create", data);

export const voteInPoll = (pollId, optionId, userId) =>
  api.post("/polls/vote", null, {
    params: { pollId, optionId, userId },
  });

export const getEventPolls = (eventId) => 
  api.get(`/polls/event/${eventId}`);
