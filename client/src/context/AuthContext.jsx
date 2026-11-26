import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('foodrescue_token');
    if (!token) return setLoading(false);
    api('/auth/me').then((data) => setUser(data.user)).catch(() => { localStorage.removeItem('foodrescue_token'); }).finally(() => setLoading(false));
  }, []);
  async function login(credentials) {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    localStorage.setItem('foodrescue_token', data.token); setUser(data.user);
    return data.user;
  }
  async function register(details) {
    return api('/auth/register', { method: 'POST', body: JSON.stringify(details) });
  }
  async function updateProfile(details) {
    const data = await api('/auth/profile', { method: 'PUT', body: JSON.stringify(details) });
    setUser(data.user);
    return data.user;
  }
  function logout() { localStorage.removeItem('foodrescue_token'); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
