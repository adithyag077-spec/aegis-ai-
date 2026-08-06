import React, { createContext, useState } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aegis_user');
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Invalid user stored in localStorage, clearing cache:', e.message);
      localStorage.removeItem('aegis_user');
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('aegis_token');
    return saved && saved !== 'undefined' ? saved : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (credentials, passwordParam) => {
    setLoading(true);
    try {
      const payload = typeof credentials === 'string' 
        ? { email: credentials, password: passwordParam } 
        : credentials;

      const data = await authService.login(payload);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, emailParam, passwordParam) => {
    setLoading(true);
    try {
      const payload = typeof userData === 'string' 
        ? { fullName: userData, email: emailParam, password: passwordParam } 
        : userData;

      const data = await authService.register(payload);
      setUser(data.user);
      setToken(data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
