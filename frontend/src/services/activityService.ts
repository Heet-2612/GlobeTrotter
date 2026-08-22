import api from './api';
import { Activity, TripActivity } from '../types';

export const activityService = {
  async searchActivities(filters?: { cityId?: number; search?: string; category?: string }): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (filters?.cityId) params.append('cityId', filters.cityId.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);

    const queryString = params.toString();
    const endpoint = queryString ? `/activities?${queryString}` : '/activities';
    return api.get<Activity[]>(endpoint, { requiresAuth: false });
  },

  async getActivityById(id: number): Promise<Activity> {
    return api.get<Activity>(`/activities/${id}`, { requiresAuth: false });
  },

  async getTripStopActivities(tripId: number, stopId: number): Promise<TripActivity[]> {
    return api.get<TripActivity[]>(`/trips/${tripId}/stops/${stopId}/activities`, { requiresAuth: true });
  },

  async assignTripActivity(tripId: number, stopId: number, data: {
    activityId: number;
    scheduledDate: string;
    startTime?: string;
    notes?: string;
    customCost?: number;
  }): Promise<TripActivity> {
    return api.post<TripActivity>(`/trips/${tripId}/stops/${stopId}/activities`, data, { requiresAuth: true });
  },

  async updateTripActivity(tripId: number, stopId: number, tripActivityId: number, data: {
    scheduledDate?: string;
    startTime?: string;
    notes?: string;
    customCost?: number;
  }): Promise<TripActivity> {
    return api.put<TripActivity>(`/trips/${tripId}/stops/${stopId}/activities/${tripActivityId}`, data, { requiresAuth: true });
  },

  async reorderTripActivities(tripId: number, stopId: number, orderedTripActivityIds: number[]): Promise<TripActivity[]> {
    return api.put<TripActivity[]>(`/trips/${tripId}/stops/${stopId}/activities/reorder`, { orderedTripActivityIds }, { requiresAuth: true });
  },

  async deleteTripActivity(tripId: number, stopId: number, tripActivityId: number): Promise<void> {
    return api.delete<void>(`/trips/${tripId}/stops/${stopId}/activities/${tripActivityId}`, { requiresAuth: true });
  }
};

export default activityService;
