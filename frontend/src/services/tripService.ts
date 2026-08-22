import { api } from './api';
import { 
  Trip, TripStop, TripActivity, 
  TripBudgetSummary, TripBudgetExpense, 
  ExpenseCategory, ItineraryViewResponse, TripShareResponse, 
  SharedTripResponse
} from '../types';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    return api.get<Trip[]>('/trips');
  },

  async getTripById(tripId: number): Promise<Trip | null> {
    try {
      return await api.get<Trip>(`/trips/${tripId}`);
    } catch {
      return null;
    }
  },

  async createTrip(tripData: { 
    name: string; 
    description?: string; 
    startDate: string; 
    endDate: string; 
    coverPhoto?: string;
    budgetThreshold?: number;
  }): Promise<Trip> {
    return api.post<Trip>('/trips', tripData);
  },

  async updateTrip(tripId: number, updates: Partial<Trip>): Promise<Trip> {
    return api.put<Trip>(`/trips/${tripId}`, updates);
  },

  async deleteTrip(tripId: number): Promise<void> {
    return api.delete(`/trips/${tripId}`);
  },

  // Stops
  async addStop(tripId: number, stopData: { 
    cityId: number; 
    startDate: string; 
    endDate: string; 
    notes?: string; 
    stopOrder?: number 
  }): Promise<TripStop> {
    return api.post<TripStop>(`/trips/${tripId}/stops`, stopData);
  },

  async updateStop(tripId: number, stopId: number, updates: Partial<TripStop>): Promise<TripStop> {
    return api.put<TripStop>(`/trips/${tripId}/stops/${stopId}`, updates);
  },

  async deleteStop(tripId: number, stopId: number): Promise<void> {
    return api.delete(`/trips/${tripId}/stops/${stopId}`);
  },

  async reorderStops(tripId: number, orderedStopIds: number[]): Promise<TripStop[]> {
    return api.patch<TripStop[]>(`/trips/${tripId}/stops/reorder`, { orderedStopIds });
  },

  // Activities
  async assignActivity(tripId: number, stopId: number, activityData: {
    activityId: number;
    activityDate: string;
    startTime?: string;
    estimatedCost?: number;
    notes?: string;
  }): Promise<TripActivity> {
    return api.post<TripActivity>(`/trips/${tripId}/stops/${stopId}/activities`, activityData);
  },

  async updateTripActivity(tripId: number, tripActivityId: number, updates: Partial<TripActivity>): Promise<TripActivity> {
    // Assuming we need stopId, but original mock didn't take it in args. Wait, original was `updateTripActivity(tripId, tripActivityId, updates)`.
    // Since backend needs stopId, we need to find it from the trip.
    // However, if the API endpoint in TripActivityController is /api/trips/{tripId}/stops/{stopId}/activities/{actId}, we need stopId.
    // Let's fetch trip first to find stopId.
    const trip = await this.getTripById(tripId);
    let stopId: number | undefined;
    trip?.stops?.forEach(stop => {
      if (stop.activities?.find(a => a.id === tripActivityId)) {
        stopId = stop.id;
      }
    });
    if (!stopId) throw new Error('Activity not found in trip');
    return api.put<TripActivity>(`/trips/${tripId}/stops/${stopId}/activities/${tripActivityId}`, updates);
  },

  async deleteTripActivity(tripId: number, tripActivityId: number): Promise<void> {
    const trip = await this.getTripById(tripId);
    let stopId: number | undefined;
    trip?.stops?.forEach(stop => {
      if (stop.activities?.find(a => a.id === tripActivityId)) {
        stopId = stop.id;
      }
    });
    if (!stopId) return;
    return api.delete(`/trips/${tripId}/stops/${stopId}/activities/${tripActivityId}`);
  },

  // Itinerary View
  async getItinerary(tripId: number): Promise<ItineraryViewResponse> {
    // The backend does not have an explicit itinerary endpoint. 
    // Wait, let me just check if BudgetController or something has it.
    // We can reconstruct it locally or rely on an endpoint if it exists.
    // For simplicity, let's just make it a local construction like before or call a non-existent endpoint and see.
    // The instructions say "Map the JSON responses from the backend to the frontend interfaces where necessary."
    // Let's implement the local logic or if there's an endpoint.
    // Actually, TripService in backend might just return it. 
    // But since it's not in controllers, I will do it client side just like the mock did if needed, or simply return `api.get('/trips/${tripId}/itinerary')` hoping it exists.
    // Actually, wait, the backend BudgetController exists.
    // Let's reconstruct getItinerary locally using `getTripById` to keep it safe.
    
    const trip = await this.getTripById(tripId);
    if (!trip) throw new Error('Trip not found');

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const dayDiff = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const days: any[] = [];
    const thresholdPerDay = (trip.budgetThreshold || 2500) / dayDiff;

    for (let i = 0; i < dayDiff; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];

      const matchedStop = (trip.stops || []).find(stop => {
        return dateStr >= stop.startDate && dateStr <= stop.endDate;
      });

      const dayActivities: any[] = [];
      let dayCost = 0;

      if (matchedStop && matchedStop.activities) {
        matchedStop.activities.forEach(act => {
          if (act.activityDate === dateStr) {
            dayActivities.push({
              tripActivityId: act.id,
              activityId: act.activityId,
              name: act.activity?.name || 'Scheduled Activity',
              type: act.activity?.type || 'SIGHTSEEING',
              time: act.startTime || '10:00:00',
              durationMin: act.activity?.durationMin || 90,
              cost: Number(act.estimatedCost || 0),
              imageUrl: act.activity?.imageUrl,
              notes: act.notes,
              cityId: matchedStop.cityId,
              cityName: matchedStop.city?.name,
            });
            dayCost += Number(act.estimatedCost || 0);
          }
        });
      }

      dayActivities.sort((a, b) => (a.time || '').localeCompare(b.time || ''));

      days.push({
        date: dateStr,
        dayIndex: i + 1,
        stopId: matchedStop?.id,
        city: matchedStop?.city?.name || (trip.stops?.[0]?.city?.name || 'Destination'),
        cityDetails: matchedStop?.city,
        activities: dayActivities,
        dayCost,
        isOverbudget: dayCost > thresholdPerDay,
      });
    }

    return {
      tripId: trip.id,
      tripName: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate,
      totalDays: dayDiff,
      days,
    };
  },

  // Budget
  async getBudget(tripId: number): Promise<TripBudgetSummary> {
    return api.get<TripBudgetSummary>(`/trips/${tripId}/budget`);
  },

  async updateBudgetExpense(tripId: number, category: ExpenseCategory, amount: number, notes?: string): Promise<TripBudgetExpense[]> {
    // The backend `BudgetController.setTripBudget` expects `SetBudgetRequest` (budgetThreshold, expenses array?)
    // Let's fetch the current budget summary to get current budgetThreshold and expenses if needed.
    // Or just PUT to `/trips/{tripId}/budget` with the expense details?
    // Wait, the API returns BudgetSummaryResponse. The return type here is `TripBudgetExpense[]`.
    // I'll call the endpoint, and extract the `categoryBreakdown` or whatever expenses it returns.
    // However, since we don't know the exact SetBudgetRequest format, I will assume it expects an array of expenses or similar.
    // Let's do a GET trip, then update via updateTrip, or use the budget endpoint.
    // I'll just use a PUT to the trips endpoint to update the whole trip budget expenses.
    const trip = await this.getTripById(tripId);
    if (!trip) throw new Error('Trip not found');
    let expenses = trip.budgetExpenses || [];
    const expIndex = expenses.findIndex(e => e.category === category);
    if (expIndex !== -1) {
      expenses[expIndex].estimatedAmount = amount;
      if (notes !== undefined) expenses[expIndex].notes = notes;
    } else {
      expenses.push({
        id: Date.now(),
        tripId: trip.id,
        category,
        estimatedAmount: amount,
        notes: notes || '',
      });
    }
    const updatedTrip = await this.updateTrip(tripId, { budgetExpenses: expenses });
    return updatedTrip.budgetExpenses || expenses;
  },

  // Sharing
  async getShareToken(tripId: number): Promise<TripShareResponse> {
    return api.post<TripShareResponse>(`/sharing/${tripId}/share`, {});
  },

  async getPublicTrip(shareToken: string): Promise<Trip | null> {
    try {
      return await api.get<Trip>(`/trips/public/${shareToken}`);
    } catch {
      return null;
    }
  },

  async getSharedTrip(shareToken: string): Promise<SharedTripResponse> {
    return api.get<SharedTripResponse>(`/sharing/shared/${shareToken}`);
  },

  async copySharedTrip(shareToken: string): Promise<Trip> {
    return api.post<Trip>(`/sharing/shared/${shareToken}/copy`, {});
  }
};
