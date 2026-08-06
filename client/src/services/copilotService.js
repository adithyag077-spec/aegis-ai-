import api from './api';

export const copilotService = {
  sendMessage: (payload) => api.post('/copilot/chat', payload),
  getHistory: (sessionId) => api.get('/copilot/history', { params: { sessionId } })
};
