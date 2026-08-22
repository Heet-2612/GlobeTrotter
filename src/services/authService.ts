import { AuthStorage } from './storage';
import { User, City } from '../types';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    // Simulated network latency for realistic feel
    await new Promise(r => setTimeout(r, 100));
    return AuthStorage.getCurrentUser();
  },

  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    await new Promise(r => setTimeout(r, 250));
    return AuthStorage.login(email, password);
  },

  async signup(name: string, email: string, password?: string, languagePreference?: string): Promise<{ token: string; user: User }> {
    await new Promise(r => setTimeout(r, 300));
    return AuthStorage.signup(name, email, password, languagePreference);
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await new Promise(r => setTimeout(r, 200));
    return AuthStorage.updateProfile(updates);
  },

  async deleteAccount(): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    AuthStorage.deleteAccount();
  },

  async logout(): Promise<void> {
    AuthStorage.logout();
  },

  async getSavedDestinations(): Promise<City[]> {
    await new Promise(r => setTimeout(r, 100));
    return AuthStorage.getSavedDestinations();
  },

  async toggleSavedDestination(cityId: number): Promise<boolean> {
    return AuthStorage.toggleSavedDestination(cityId);
  }
};
