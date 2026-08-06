import api from './api';

export const breachService = {
  checkBreach: (payload) => api.post('/breach/check', payload),
  getHistory: () => api.get('/breach/history')
};
