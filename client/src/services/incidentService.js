import api from './api';

export const incidentService = {
  getIncidents: () => api.get('/incidents'),
  createIncident: (data) => api.post('/incidents', data),
  updateStatus: (id, status) => api.patch(`/incidents/${id}`, { status }),
};
