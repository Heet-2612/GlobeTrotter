import api from './api';
import { TripStop } from '../types';

export const stopService = {
  async getStops(tripId: number): Promise<TripStop[]> {
    return api.get<TripStop[]>(`/trips/${tripId}/stops`, { requiresAuth: true });
  },

  async addStop(tripId: number, data: { cityId: number; startDate: string; endDate: string; notes?: string }): Promise<TripStop> {
    return api.post<TripStop>(`/trips/${tripId}/stops`, data, { requiresAuth: true });
  },

  async updateStop(tripId: number, stopId: number, data: { startDate?: string; endDate?: string; notes?: string }): Promise<TripStop> {
    return api.put<TripStop>(`/trips/${tripId}/stops/${stopId}`, data, { requiresAuth: true });
  },

  async reorderStops(tripId: number, orderedStopIds: number[]): Promise<TripStop[]> {
    const payload = { stopIds: orderedStopIds, orderedStopIds };
    try {
      return await api.patch<TripStop[]>(`/trips/${tripId}/stops/reorder`, payload, { requiresAuth: true });
    } catch (e) {
      return await api.put<TripStop[]>(`/trips/${tripId}/stops/reorder`, payload, { requiresAuth: true });
    }
  },

  async deleteStop(tripId: number, stopId: number): Promise<void> {
    return api.delete<void>(`/trips/${tripId}/stops/${stopId}`, { requiresAuth: true });
  }
};

export default stopService;
