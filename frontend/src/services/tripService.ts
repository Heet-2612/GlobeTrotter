import api from './api';
import { Trip, TripStop, TripActivity, BudgetSummaryResponse, TripSharingResponse, PublicTripItineraryResponse, SharedTripResponse, ItineraryViewResponse, TripBudgetSummary, TripShareResponse } from '../types';

export const tripService = {
  // Trips
  async getTrips(): Promise<Trip[]> {
    return api.get<Trip[]>('/trips', { requiresAuth: true });
  },

  async getTripById(tripId: number): Promise<Trip> {
    return api.get<Trip>(`/trips/${tripId}`, { requiresAuth: true });
  },

  async createTrip(tripData: { 
    name: string; 
    description?: string; 
    startDate: string; 
    endDate: string; 
    coverPhoto?: string;
    budget?: number;
    budgetThreshold?: number;
  }): Promise<Trip> {
    const payload = {
      name: tripData.name,
      description: tripData.description,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      coverPhoto: tripData.coverPhoto,
      budget: tripData.budget ?? tripData.budgetThreshold,
    };
    return api.post<Trip>('/trips', payload, { requiresAuth: true });
  },

  async updateTrip(tripId: number, updates: Partial<Trip>): Promise<Trip> {
    let currentTrip: Trip | null = null;
    if (!updates.name || !updates.startDate || !updates.endDate) {
      currentTrip = await this.getTripById(tripId);
    }

    const payload = {
      name: updates.name ?? currentTrip?.name ?? '',
      description: updates.description ?? currentTrip?.description ?? '',
      startDate: updates.startDate ?? currentTrip?.startDate ?? '',
      endDate: updates.endDate ?? currentTrip?.endDate ?? '',
      coverPhoto: updates.coverPhoto ?? currentTrip?.coverPhoto ?? '',
      budget: updates.budget ?? updates.budgetThreshold ?? currentTrip?.budget ?? currentTrip?.budgetThreshold ?? null,
    };

    return api.put<Trip>(`/trips/${tripId}`, payload, { requiresAuth: true });
  },

  async deleteTrip(tripId: number): Promise<void> {
    return api.delete<void>(`/trips/${tripId}`, { requiresAuth: true });
  },

  // Stops
  async getStops(tripId: number): Promise<TripStop[]> {
    return api.get<TripStop[]>(`/trips/${tripId}/stops`, { requiresAuth: true });
  },

  async addStop(tripId: number, stopData: { 
    cityId: number; 
    startDate: string; 
    endDate: string; 
    notes?: string; 
  }): Promise<TripStop> {
    return api.post<TripStop>(`/trips/${tripId}/stops`, stopData, { requiresAuth: true });
  },

  async updateStop(tripId: number, stopId: number, updates: {
    startDate?: string;
    endDate?: string;
    notes?: string;
  }): Promise<TripStop> {
    return api.put<TripStop>(`/trips/${tripId}/stops/${stopId}`, updates, { requiresAuth: true });
  },

  async deleteStop(tripId: number, stopId: number): Promise<void> {
    return api.delete<void>(`/trips/${tripId}/stops/${stopId}`, { requiresAuth: true });
  },

  async reorderStops(tripId: number, orderedStopIds: number[]): Promise<TripStop[]> {
    return api.put<TripStop[]>(`/trips/${tripId}/stops/reorder`, { orderedStopIds }, { requiresAuth: true });
  },

  // Activities
  async getActivitiesForStop(tripId: number, stopId: number): Promise<TripActivity[]> {
    return api.get<TripActivity[]>(`/trips/${tripId}/stops/${stopId}/activities`, { requiresAuth: true });
  },

  async assignActivity(tripId: number, stopId: number, activityData: {
    activityId: number;
    scheduledDate?: string;
    activityDate?: string;
    startTime?: string;
    notes?: string;
    customCost?: number;
    estimatedCost?: number;
  }): Promise<TripActivity> {
    const payload = {
      activityId: activityData.activityId,
      scheduledDate: activityData.scheduledDate || activityData.activityDate || '',
      startTime: activityData.startTime,
      notes: activityData.notes,
      customCost: activityData.customCost ?? activityData.estimatedCost,
    };
    return api.post<TripActivity>(`/trips/${tripId}/stops/${stopId}/activities`, payload, { requiresAuth: true });
  },

  async updateTripActivity(tripId: number, stopId: number, tripActivityId: number, updates: {
    scheduledDate?: string;
    startTime?: string;
    notes?: string;
    customCost?: number;
  }): Promise<TripActivity> {
    return api.put<TripActivity>(`/trips/${tripId}/stops/${stopId}/activities/${tripActivityId}`, updates, { requiresAuth: true });
  },

  async deleteTripActivity(tripId: number, stopIdOrActivityId: number, tripActivityId?: number): Promise<void> {
    if (tripActivityId !== undefined) {
      return api.delete<void>(`/trips/${tripId}/stops/${stopIdOrActivityId}/activities/${tripActivityId}`, { requiresAuth: true });
    } else {
      const stops = await this.getStops(tripId);
      for (const stop of stops) {
        const activities = await this.getActivitiesForStop(tripId, stop.id);
        const match = activities.find(a => a.id === stopIdOrActivityId);
        if (match) {
          return api.delete<void>(`/trips/${tripId}/stops/${stop.id}/activities/${stopIdOrActivityId}`, { requiresAuth: true });
        }
      }
    }
  },

  async reorderTripActivities(tripId: number, stopId: number, orderedTripActivityIds: number[]): Promise<TripActivity[]> {
    return api.put<TripActivity[]>(`/trips/${tripId}/stops/${stopId}/activities/reorder`, { orderedTripActivityIds }, { requiresAuth: true });
  },

  // Itinerary View Synthesis
  async getItinerary(tripId: number): Promise<ItineraryViewResponse> {
    const trip = await this.getTripById(tripId);
    const stops = await this.getStops(tripId);
    const daysMap: Record<string, any[]> = {};

    for (const stop of stops) {
      const activities = await this.getActivitiesForStop(tripId, stop.id);
      for (const ta of activities) {
        const dateKey = ta.scheduledDate || ta.activityDate || stop.startDate;
        if (!daysMap[dateKey]) daysMap[dateKey] = [];
        daysMap[dateKey].push({
          tripActivityId: ta.id,
          activityId: ta.activity?.id || 0,
          name: ta.activity?.name || 'Activity',
          type: (ta.activity?.category as any) || 'SIGHTSEEING',
          time: ta.startTime || '',
          durationMin: ta.activity?.estimatedDurationMinutes || ta.activity?.durationMin || 60,
          cost: ta.customCost ?? ta.activity?.estimatedCost ?? 0,
          imageUrl: ta.activity?.imageUrl || undefined,
          notes: ta.notes || undefined,
          cityId: stop.city?.id,
          cityName: stop.city?.name,
        });
      }
    }

    const sortedDates = Object.keys(daysMap).sort();
    const days = sortedDates.map((date, idx) => ({
      date,
      dayIndex: idx + 1,
      activities: daysMap[date],
      dayCost: daysMap[date].reduce((sum, item) => sum + item.cost, 0),
    }));

    return {
      tripId: trip.id,
      tripName: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      totalDays: days.length,
      days,
    };
  },

  // Budget
  async getBudget(tripId: number): Promise<BudgetSummaryResponse> {
    return api.get<BudgetSummaryResponse>(`/trips/${tripId}/budget`, { requiresAuth: true });
  },

  async setBudget(tripId: number, budget: number): Promise<BudgetSummaryResponse> {
    return api.put<BudgetSummaryResponse>(`/trips/${tripId}/budget`, { budget }, { requiresAuth: true });
  },

  async getBudgetSummary(tripId: number): Promise<TripBudgetSummary> {
    const res = await this.getBudget(tripId);
    const categoryBreakdown: Record<string, number> = {};
    if (res.categoryBreakdown) {
      res.categoryBreakdown.forEach(item => {
        categoryBreakdown[item.category] = item.cost;
      });
    }
    return {
      tripId: res.tripId,
      totalEstimatedCost: res.totalActivityCost,
      budgetThreshold: res.budget || 0,
      averageCostPerDay: 0,
      totalDays: 0,
      categoryBreakdown,
      dailyBreakdown: [],
      overbudgetDays: [],
    };
  },

  // Sharing
  async getShareStatus(tripId: number): Promise<TripSharingResponse> {
    return api.get<TripSharingResponse>(`/trips/${tripId}/sharing`, { requiresAuth: true });
  },

  async getShareToken(tripId: number): Promise<TripShareResponse> {
    const status = await this.getShareStatus(tripId);
    return {
      shareToken: status.shareToken || '',
      publicUrl: status.publicUrl || (status.shareToken ? `/shared/${status.shareToken}` : ''),
      isPublic: status.isPublic,
    };
  },

  async updateSharing(tripId: number, isPublic: boolean): Promise<TripSharingResponse> {
    return api.put<TripSharingResponse>(`/trips/${tripId}/sharing`, { isPublic }, { requiresAuth: true });
  },

  async getPublicTrip(shareToken: string): Promise<PublicTripItineraryResponse> {
    return api.get<PublicTripItineraryResponse>(`/public/trips/${shareToken}`, { requiresAuth: false });
  },

  async getSharedTrip(shareToken: string): Promise<SharedTripResponse> {
    const itinerary = await this.getPublicTrip(shareToken);
    return {
      trip: {
        id: itinerary.tripId,
        name: itinerary.name,
        description: itinerary.description,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        coverPhoto: itinerary.coverPhoto,
        budget: itinerary.budget,
        isPublic: true,
        shareToken: itinerary.shareToken,
      },
      owner: {
        id: 0,
        name: itinerary.creatorName,
        email: '',
      },
      itinerary: {
        tripId: itinerary.tripId,
        tripName: itinerary.name,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        totalDays: 0,
        days: itinerary.stops.map((stop, sIdx) => ({
          date: stop.startDate,
          dayIndex: sIdx + 1,
          stopId: stop.stopId,
          city: stop.city.name,
          cityDetails: stop.city,
          activities: stop.activities.map(act => ({
            tripActivityId: act.tripActivityId,
            activityId: 0,
            name: act.activityName,
            type: (act.category as any) || 'SIGHTSEEING',
            time: act.startTime || '',
            durationMin: act.durationMinutes,
            cost: act.cost,
            notes: act.notes || '',
          })),
          dayCost: stop.activities.reduce((sum, a) => sum + a.cost, 0),
        })),
      },
      isPublic: true,
    };
  },

  async copySharedTrip(shareToken: string): Promise<Trip> {
    return api.post<Trip>(`/public/trips/${shareToken}/copy`, null, { requiresAuth: true });
  }
};

export default tripService;
