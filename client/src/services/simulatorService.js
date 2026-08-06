import api from './api';

export const simulatorService = {
  getScenarios: () => api.get('/simulator/scenarios'),
  submitDecision: (payload) => api.post('/simulator/submit', payload),
  getUserProgress: () => api.get('/simulator/progress')
};
