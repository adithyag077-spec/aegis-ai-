import api from './api';

export const authService = {
  login: async (credentials) => {
    const payload = typeof credentials === 'string' ? { email: credentials } : credentials;
    const res = await api.post('/auth/login', payload);
    const authData = res.data || res;
    if (authData?.token) {
      localStorage.setItem('aegis_token', authData.token);
      localStorage.setItem('aegis_user', JSON.stringify(authData.user));
    }
    return authData;
  },

  register: async (userData) => {
    const payload = typeof userData === 'string' ? { fullName: userData } : userData;
    const res = await api.post('/auth/register', payload);
    const authData = res.data || res;
    if (authData?.token) {
      localStorage.setItem('aegis_token', authData.token);
      localStorage.setItem('aegis_user', JSON.stringify(authData.user));
    }
    return authData;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data || res;
  },

  logout: () => {
    localStorage.removeItem('aegis_token');
    localStorage.removeItem('aegis_user');
  }
};
