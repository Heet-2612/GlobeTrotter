import api from './api';
import { TripSharingResponse, PublicTripItineraryResponse, Trip } from '../types';

export const sharingService = {
  async updateSharing(tripId: number, isPublic: boolean): Promise<TripSharingResponse> {
    return api.put<TripSharingResponse>(`/trips/${tripId}/sharing`, { isPublic }, { requiresAuth: true });
  },

  async getSharingStatus(tripId: number): Promise<TripSharingResponse> {
    return api.get<TripSharingResponse>(`/trips/${tripId}/sharing`, { requiresAuth: true });
  },

  async getPublicTripItinerary(shareToken: string): Promise<PublicTripItineraryResponse> {
    return api.get<PublicTripItineraryResponse>(`/public/trips/${shareToken}`, { requiresAuth: false });
  },

  async copyPublicTrip(shareToken: string): Promise<Trip> {
    return api.post<Trip>(`/public/trips/${shareToken}/copy`, null, { requiresAuth: true });
  }
};

export default sharingService;
