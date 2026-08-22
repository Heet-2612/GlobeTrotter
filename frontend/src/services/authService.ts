import api, { setToken, removeToken, getToken } from './api';
import { User, AuthResponse } from '../types';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    const token = getToken();
    if (!token) {
      return null;
    }
    try {
      const user = await api.get<User>('/users/me', { requiresAuth: true });
      return user;
    } catch (error) {
      removeToken();
      return null;
    }
  },

  async login(email: string, password?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password }, { requiresAuth: false });
    if (response && response.token) {
      setToken(response.token);
    }
    return response;
  },

  async signup(name: string, email: string, password?: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', { name, email, password }, { requiresAuth: false });
    if (response && response.token) {
      setToken(response.token);
    }
    return response;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    return api.put<User>('/users/me', updates, { requiresAuth: true });
  },

  async logout(): Promise<void> {
    removeToken();
  }
};

export default authService;
