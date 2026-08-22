import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, City } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  savedDestinations: City[];
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password?: string, languagePreference?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  deleteAccount: () => Promise<void>;
  toggleSaveDestination: (cityId: number) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [savedDestinations, setSavedDestinations] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const saved = await authService.getSavedDestinations();
        setSavedDestinations(saved);
      }
    } catch (e) {
      console.error('Failed to load current user', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      const saved = await authService.getSavedDestinations();
      setSavedDestinations(saved);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password?: string, languagePreference?: string) => {
    setLoading(true);
    try {
      const res = await authService.signup(name, email, password, languagePreference);
      setUser(res.user);
      setToken(res.token);
      const saved = await authService.getSavedDestinations();
      setSavedDestinations(saved);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setSavedDestinations([]);
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const deleteAccount = async () => {
    await authService.deleteAccount();
    setUser(null);
    setToken(null);
    setSavedDestinations([]);
  };

  const toggleSaveDestination = async (cityId: number) => {
    const isSaved = await authService.toggleSavedDestination(cityId);
    const updatedSaved = await authService.getSavedDestinations();
    setSavedDestinations(updatedSaved);
    if (user) {
      setUser({ ...user, savedDestinationsCount: updatedSaved.length });
    }
    return isSaved;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        savedDestinations,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
        toggleSaveDestination,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
