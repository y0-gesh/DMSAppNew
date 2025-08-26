// context/AuthContext.tsx
import { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext({
  token: null,
  userId: null,
  login: async (_token: string, _userId: string) => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function load() {
      const t = await SecureStore.getItemAsync('token');
      const u = await SecureStore.getItemAsync('userId');
      if (t) setToken(t);
      if (u) setUserId(u);
    }
    load();
  }, []);

  const login = async (t: string, u: string) => {
    setToken(t);
    setUserId(u);
    await SecureStore.setItemAsync('token', t);
    await SecureStore.setItemAsync('userId', u);
  };

  const logout = async () => {
    setToken(null);
    setUserId(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userId');
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}