import { TripStorage, AuthStorage, initLocalStorage, decodeTripToken } from './storage';
import { 
  Trip, TripStop, TripActivity, 
  TripBudgetSummary, TripBudgetExpense, 
  ExpenseCategory, ItineraryViewResponse, TripShareResponse, 
  SharedTripResponse, User
} from '../types';
import { SEED_USERS, INITIAL_TRIPS } from '../data/seedData';

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.getAllForUser();
  },

  async getTripById(tripId: number): Promise<Trip | null> {
    await new Promise(r => setTimeout(r, 50));
    return TripStorage.getById(tripId);
  },

  async createTrip(tripData: { 
    name: string; 
    description?: string; 
    startDate: string; 
    endDate: string; 
    coverPhoto?: string;
    budgetThreshold?: number;
  }): Promise<Trip> {
    await new Promise(r => setTimeout(r, 80));
    return TripStorage.create(tripData);
  },

  async updateTrip(tripId: number, updates: Partial<Trip>): Promise<Trip> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.update(tripId, updates);
  },

  async deleteTrip(tripId: number): Promise<void> {
    await new Promise(r => setTimeout(r, 60));
    TripStorage.delete(tripId);
  },

  // Stops
  async addStop(tripId: number, stopData: { 
    cityId: number; 
    startDate: string; 
    endDate: string; 
    notes?: string; 
    stopOrder?: number 
  }): Promise<TripStop> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.addStop(tripId, stopData);
  },

  async updateStop(tripId: number, stopId: number, updates: Partial<TripStop>): Promise<TripStop> {
    await new Promise(r => setTimeout(r, 50));
    return TripStorage.updateStop(tripId, stopId, updates);
  },

  async deleteStop(tripId: number, stopId: number): Promise<void> {
    await new Promise(r => setTimeout(r, 50));
    TripStorage.deleteStop(tripId, stopId);
  },

  async reorderStops(tripId: number, orderedStopIds: number[]): Promise<TripStop[]> {
    await new Promise(r => setTimeout(r, 50));
    return TripStorage.reorderStops(tripId, orderedStopIds);
  },

  // Activities
  async assignActivity(tripId: number, stopId: number, activityData: {
    activityId: number;
    activityDate: string;
    startTime?: string;
    estimatedCost?: number;
    notes?: string;
  }): Promise<TripActivity> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.assignActivity(tripId, stopId, activityData);
  },

  async updateTripActivity(tripId: number, tripActivityId: number, updates: Partial<TripActivity>): Promise<TripActivity> {
    await new Promise(r => setTimeout(r, 50));
    return TripStorage.updateTripActivity(tripId, tripActivityId, updates);
  },

  async deleteTripActivity(tripId: number, tripActivityId: number): Promise<void> {
    await new Promise(r => setTimeout(r, 50));
    TripStorage.deleteTripActivity(tripId, tripActivityId);
  },

  // Itinerary View
  async getItinerary(tripId: number): Promise<ItineraryViewResponse> {
    await new Promise(r => setTimeout(r, 50));
    return TripStorage.getItinerary(tripId);
  },

  // Budget
  async getBudget(tripId: number): Promise<TripBudgetSummary> {
    await new Promise(r => setTimeout(r, 50));
    return TripStorage.getBudgetSummary(tripId);
  },

  async updateBudgetExpense(tripId: number, category: ExpenseCategory, amount: number, notes?: string): Promise<TripBudgetExpense[]> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.updateBudgetExpense(tripId, category, amount, notes);
  },

  // Sharing
  async getShareToken(tripId: number): Promise<TripShareResponse> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.getShareToken(tripId);
  },

  async getSharing(tripId: number): Promise<TripShareResponse> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.getShareToken(tripId);
  },

  async updateSharing(tripId: number, isPublic: boolean): Promise<TripShareResponse> {
    await new Promise(r => setTimeout(r, 60));
    return TripStorage.updateSharing(tripId, isPublic);
  },

  async getPublicTrip(shareToken: string): Promise<Trip | null> {
    await new Promise(r => setTimeout(r, 50));
    return TripStorage.getByShareToken(shareToken);
  },

  async getSharedTrip(shareToken: string): Promise<SharedTripResponse> {
    await new Promise(r => setTimeout(r, 60));
    
    // Check if token has decoded owner
    let decodedOwner: User | null = null;
    if (shareToken && shareToken.startsWith('p_')) {
      const decoded = decodeTripToken(shareToken);
      if (decoded) {
        decodedOwner = decoded.owner;
      }
    }

    const trip = TripStorage.getByShareToken(shareToken);
    if (!trip) throw new Error('Shared trip not found');
    const itinerary = TripStorage.getItinerary(trip.id);
    const usersRaw = localStorage.getItem('gt_users');
    const users: User[] = usersRaw ? JSON.parse(usersRaw) : SEED_USERS;
    const owner = decodedOwner || users.find(u => u.id === trip.userId) || {
      id: trip.userId,
      name: 'Travel Explorer',
      email: 'explorer@globetrotter.io',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };
    return {
      trip,
      owner,
      itinerary,
      isPublic: trip.isPublic ?? true,
    };
  },

  async copySharedTrip(shareToken: string): Promise<Trip> {
    await new Promise(r => setTimeout(r, 100));
    return TripStorage.copyTrip(shareToken);
  }
};
