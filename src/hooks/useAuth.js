'use client'

import { useState, useEffect, createContext, useContext } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing auth on mount
    const storedUser = authApi.getStoredUser();
    if (storedUser && authApi.isAuthenticated()) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    const response = await authApi.login(identifier, password);
    if (response && response.user) {
      setUser(response.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const register = async (email, username, password, phone) => {
    const user = await authApi.register(email, username, password, phone);
    return user;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    try {
      const userData = await authApi.getMe();
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return userData;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;
