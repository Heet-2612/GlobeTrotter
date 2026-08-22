import { api } from './api';
import { User, City } from '../types';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      return await api.get<User>('/users/me');
    } catch {
      return null;
    }
  },

  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    const res = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('gt_auth_token', res.token);
    return res;
  },

  async signup(name: string, email: string, password?: string): Promise<{ token: string; user: User }> {
    const res = await api.post<{ token: string; user: User }>('/auth/signup', { name, email, password });
    localStorage.setItem('gt_auth_token', res.token);
    return res;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    return api.put<User>('/users/me', updates);
  },

  async deleteAccount(): Promise<void> {
    await api.delete('/users/me');
    this.logout();
  },

  async logout(): Promise<void> {
    localStorage.removeItem('gt_auth_token');
  },

  async getSavedDestinations(): Promise<City[]> {
    return api.get<City[]>('/users/saved-destinations');
  },

  async toggleSavedDestination(cityId: number): Promise<boolean> {
    return api.post<boolean>(`/users/saved-destinations/${cityId}/toggle`, {});
  }
};
