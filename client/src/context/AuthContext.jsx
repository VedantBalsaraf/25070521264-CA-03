import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login, signup, getCurrentUser, logout, getStoredUser, getStoredToken, updateProfile } from '../services/authService';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshUser = useCallback(async () => {
    const storedToken = getStoredToken();
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      setToken(storedToken);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error('Failed to refresh user:', err);
      logout();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const handleLogin = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData, token: authToken } = await login(credentials);
      setUser(userData);
      setToken(authToken);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignup = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData, token: authToken } = await signup(data);
      setUser(userData);
      setToken(authToken);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUser(null);
    setToken(null);
  }, []);

  const handleUpdateProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    refreshUser,
    updateProfile: handleUpdateProfile,
    clearError
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