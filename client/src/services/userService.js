import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  getRiskOverview: () => api.get('/users/risk-overview'),
  getUserAnalytics: () => api.get('/analytics/user-summary')
};
