import { 
  User, City, Activity, Trip, TripStop, TripActivity, 
  TripBudgetExpense, TripBudgetSummary, ExpenseCategory, 
  ItineraryViewResponse, DayItinerary, DayActivityItem, 
  AdminAnalytics, TripShareResponse, OverbudgetDay, Country 
} from '../types';
import { 
  SEED_USERS, SEED_CITIES, SEED_ACTIVITIES, 
  INITIAL_TRIPS, INITIAL_SAVED_DESTINATIONS, SEED_COUNTRIES 
} from '../data/seedData';

export const COUNTRIES_CITIES_API_KEY = 
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_COUNTRIES_CITIES_API_KEY) || 
  'mmsl_Ub2TuvMWGlmyX11wmiDTRZ3NdCJNeiG9';

const STORAGE_KEYS = {
  USERS: 'gt_users',
  CURRENT_USER: 'gt_current_user',
  TOKEN: 'gt_auth_token',
  COUNTRIES: 'gt_countries',
  CITIES: 'gt_cities',
  ACTIVITIES: 'gt_activities',
  TRIPS: 'gt_trips',
  SAVED_DESTINATIONS: 'gt_saved_destinations',
  VIEWS: 'gt_trip_views',
};

// Initialize Storage with seed data if not present
export function initLocalStorage(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lQGV4YW1wbGUuY29tIiwidXNlcklkIjoxfQ.demo_jwt_token_globetrotter');
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUNTRIES)) {
    localStorage.setItem(STORAGE_KEYS.COUNTRIES, JSON.stringify(SEED_COUNTRIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CITIES)) {
    localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(SEED_CITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRIPS)) {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_TRIPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_DESTINATIONS)) {
    localStorage.setItem(STORAGE_KEYS.SAVED_DESTINATIONS, JSON.stringify(INITIAL_SAVED_DESTINATIONS));
  }
}

// Helpers
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error parsing storage key ${key}:`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting storage key ${key}:`, e);
  }
}

// ----------------- AUTH & USER STORAGE -----------------
export const AuthStorage = {
  getCurrentUser(): User | null {
    initLocalStorage();
    return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]);
  },
  
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  login(email: string, password?: string): { token: string; user: User } {
    initLocalStorage();
    const users = getStored<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (matched) {
      const token = `gt_jwt_${matched.id}_${Date.now()}`;
      setStored(STORAGE_KEYS.CURRENT_USER, matched);
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      return { token, user: matched };
    }
    
    // Auto-create for friendly demo experience if password provided
    const newUser: User = {
      id: Date.now(),
      name: email.split('@')[0].replace('.', ' ').replace(/^\w/, c => c.toUpperCase()),
      email: email,
      profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      languagePreference: 'en',
      savedDestinationsCount: 0,
      role: 'USER',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);
    const token = `gt_jwt_${newUser.id}_${Date.now()}`;
    setStored(STORAGE_KEYS.CURRENT_USER, newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return { token, user: newUser };
  },

  signup(name: string, email: string, password?: string): { token: string; user: User } {
    initLocalStorage();
    const users = getStored<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return this.login(email, password);
    }
    const newUser: User = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      languagePreference: 'en',
      savedDestinationsCount: 0,
      role: 'USER',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);
    const token = `gt_jwt_${newUser.id}_${Date.now()}`;
    setStored(STORAGE_KEYS.CURRENT_USER, newUser);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    return { token, user: newUser };
  },

  updateProfile(updates: Partial<User>): User {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Unauthenticated');
    const updated: User = { ...current, ...updates };
    setStored(STORAGE_KEYS.CURRENT_USER, updated);
    
    const users = getStored<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const index = users.findIndex(u => u.id === current.id);
    if (index !== -1) {
      users[index] = updated;
      setStored(STORAGE_KEYS.USERS, users);
    }
    return updated;
  },

  deleteAccount(): void {
    const current = this.getCurrentUser();
    if (current) {
      const users = getStored<User[]>(STORAGE_KEYS.USERS, SEED_USERS).filter(u => u.id !== current.id);
      setStored(STORAGE_KEYS.USERS, users);
      // Delete user's trips
      const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS).filter(t => t.userId !== current.id);
      setStored(STORAGE_KEYS.TRIPS, trips);
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getSavedDestinations(): City[] {
    const cityIds = getStored<number[]>(STORAGE_KEYS.SAVED_DESTINATIONS, INITIAL_SAVED_DESTINATIONS);
    const cities = getStored<City[]>(STORAGE_KEYS.CITIES, SEED_CITIES);
    return cities.filter(c => cityIds.includes(c.id));
  },

  toggleSavedDestination(cityId: number): boolean {
    const cityIds = getStored<number[]>(STORAGE_KEYS.SAVED_DESTINATIONS, INITIAL_SAVED_DESTINATIONS);
    let updated: number[];
    let isSaved = false;
    if (cityIds.includes(cityId)) {
      updated = cityIds.filter(id => id !== cityId);
    } else {
      updated = [...cityIds, cityId];
      isSaved = true;
    }
    setStored(STORAGE_KEYS.SAVED_DESTINATIONS, updated);
    
    // Update user saved count
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.updateProfile({ savedDestinationsCount: updated.length });
    }
    return isSaved;
  }
};

// ----------------- COUNTRIES STORAGE -----------------
export const CountryStorage = {
  getAll(params?: { search?: string; region?: string }): Country[] {
    initLocalStorage();
    let countries = getStored<Country[]>(STORAGE_KEYS.COUNTRIES, SEED_COUNTRIES);
    if (!params) return countries;

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      countries = countries.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q) || 
        c.region.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q)
      );
    }
    if (params.region && params.region !== 'ALL') {
      countries = countries.filter(c => c.region.toLowerCase() === params.region?.toLowerCase());
    }
    return countries;
  },

  getByCode(code: string): Country | null {
    initLocalStorage();
    const countries = getStored<Country[]>(STORAGE_KEYS.COUNTRIES, SEED_COUNTRIES);
    return countries.find(c => c.code.toUpperCase() === code.toUpperCase() || c.name.toLowerCase() === code.toLowerCase()) || null;
  },

  getApiKey(): string {
    return COUNTRIES_CITIES_API_KEY;
  }
};

// ----------------- CITIES & ACTIVITIES STORAGE -----------------
export const CityStorage = {
  getAll(params?: { search?: string; country?: string; region?: string }): City[] {
    initLocalStorage();
    let cities = getStored<City[]>(STORAGE_KEYS.CITIES, SEED_CITIES);
    if (!params) return cities;

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      cities = cities.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.country.toLowerCase().includes(q) || 
        c.region.toLowerCase().includes(q)
      );
    }
    if (params.country && params.country !== 'ALL') {
      cities = cities.filter(c => c.country.toLowerCase() === params.country?.toLowerCase());
    }
    if (params.region && params.region !== 'ALL') {
      cities = cities.filter(c => c.region.toLowerCase() === params.region?.toLowerCase());
    }
    return cities;
  },

  getById(cityId: number): City | null {
    initLocalStorage();
    const cities = getStored<City[]>(STORAGE_KEYS.CITIES, SEED_CITIES);
    return cities.find(c => c.id === cityId) || null;
  },

  getActivitiesForCity(cityId: number, filters?: { type?: string; maxCost?: number; maxDuration?: number }): Activity[] {
    initLocalStorage();
    const allActivities = getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES);
    let list = allActivities.filter(a => a.cityId === cityId);

    if (filters?.type && filters.type !== 'ALL') {
      list = list.filter(a => a.type === filters.type);
    }
    if (filters?.maxCost !== undefined && filters.maxCost > 0) {
      list = list.filter(a => a.estimatedCost <= (filters.maxCost ?? 9999));
    }
    if (filters?.maxDuration !== undefined && filters.maxDuration > 0) {
      list = list.filter(a => a.durationMin <= (filters.maxDuration ?? 9999));
    }
    return list;
  },

  getAllActivities(filters?: { type?: string; maxCost?: number; maxDuration?: number; search?: string; cityId?: number }): Activity[] {
    initLocalStorage();
    let list = getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES);
    if (!filters) return list;

    if (filters.cityId) {
      list = list.filter(a => a.cityId === filters.cityId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    if (filters.type && filters.type !== 'ALL') {
      list = list.filter(a => a.type === filters.type);
    }
    if (filters.maxCost !== undefined && filters.maxCost > 0) {
      list = list.filter(a => a.estimatedCost <= filters.maxCost);
    }
    if (filters.maxDuration !== undefined && filters.maxDuration > 0) {
      list = list.filter(a => a.durationMin <= filters.maxDuration);
    }
    return list;
  }
};

// ----------------- TRIPS & ITINERARY STORAGE -----------------
export const TripStorage = {
  getAllForUser(): Trip[] {
    initLocalStorage();
    const user = AuthStorage.getCurrentUser();
    if (!user) return [];
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    return trips.filter(t => t.userId === user.id);
  },

  getById(tripId: number): Trip | null {
    initLocalStorage();
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip) return null;

    // Attach full city and activity references for complete hydration
    const cities = getStored<City[]>(STORAGE_KEYS.CITIES, SEED_CITIES);
    const activities = getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES);

    const hydratedStops = (trip.stops || []).map(stop => {
      const city = cities.find(c => c.id === stop.cityId);
      const hydratedActivities = (stop.activities || []).map(act => {
        const activity = activities.find(a => a.id === act.activityId);
        return {
          ...act,
          activity,
        };
      });
      return {
        ...stop,
        city,
        activities: hydratedActivities,
      };
    });

    return {
      ...trip,
      stops: hydratedStops,
      destinationCount: hydratedStops.length,
      estimatedTotalCost: this.calculateTripTotalCost(trip),
    };
  },

  calculateTripTotalCost(trip: Trip): number {
    let activityTotal = 0;
    (trip.stops || []).forEach(stop => {
      (stop.activities || []).forEach(act => {
        activityTotal += Number(act.estimatedCost || 0);
      });
    });

    let expenseTotal = 0;
    (trip.budgetExpenses || []).forEach(exp => {
      if (exp.category !== 'ACTIVITIES') {
        expenseTotal += Number(exp.estimatedAmount || 0);
      }
    });

    return expenseTotal + activityTotal;
  },

  create(tripData: { name: string; description?: string; startDate: string; endDate: string; coverPhoto?: string; budgetThreshold?: number }): Trip {
    initLocalStorage();
    const user = AuthStorage.getCurrentUser();
    if (!user) throw new Error('Unauthenticated');

    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    
    // Auto-pick cover photo if not provided
    const defaultCovers = [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    ];
    const cover = tripData.coverPhoto?.trim() || defaultCovers[Math.floor(Math.random() * defaultCovers.length)];

    const newTrip: Trip = {
      id: Date.now(),
      userId: user.id,
      name: tripData.name.trim(),
      description: tripData.description?.trim() || '',
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      coverPhoto: cover,
      destinationCount: 0,
      estimatedTotalCost: 0,
      budgetThreshold: tripData.budgetThreshold || 2500,
      isPublic: true,
      shareToken: `trip-share-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stops: [],
      budgetExpenses: [
        { id: Date.now() + 1, tripId: Date.now(), category: 'TRANSPORT', estimatedAmount: 450, notes: 'Flights / Rail' },
        { id: Date.now() + 2, tripId: Date.now(), category: 'STAY', estimatedAmount: 800, notes: 'Hotels / Lodging' },
        { id: Date.now() + 3, tripId: Date.now(), category: 'ACTIVITIES', estimatedAmount: 200, notes: 'Entry tickets & tours' },
        { id: Date.now() + 4, tripId: Date.now(), category: 'MEALS', estimatedAmount: 300, notes: 'Food & dining' },
      ]
    };

    newTrip.estimatedTotalCost = this.calculateTripTotalCost(newTrip);
    trips.unshift(newTrip);
    setStored(STORAGE_KEYS.TRIPS, trips);
    return newTrip;
  },

  update(tripId: number, updates: Partial<Trip>): Trip {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const index = trips.findIndex(t => t.id === Number(tripId));
    if (index === -1) throw new Error('Trip not found');

    const updated = {
      ...trips[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    updated.estimatedTotalCost = this.calculateTripTotalCost(updated);
    trips[index] = updated;
    setStored(STORAGE_KEYS.TRIPS, trips);
    return updated;
  },

  delete(tripId: number): void {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const filtered = trips.filter(t => t.id !== Number(tripId));
    setStored(STORAGE_KEYS.TRIPS, filtered);
  },

  // Stop Management
  addStop(tripId: number, stopData: { cityId: number; startDate: string; endDate: string; notes?: string; stopOrder?: number }): TripStop {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip) throw new Error('Trip not found');

    if (!trip.stops) trip.stops = [];
    const nextOrder = stopData.stopOrder || (trip.stops.length + 1);

    const newStop: TripStop = {
      id: Date.now(),
      tripId: Number(tripId),
      cityId: Number(stopData.cityId),
      stopOrder: nextOrder,
      startDate: stopData.startDate,
      endDate: stopData.endDate,
      notes: stopData.notes || '',
      activities: []
    };

    trip.stops.push(newStop);
    trip.destinationCount = trip.stops.length;
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);

    const cities = getStored<City[]>(STORAGE_KEYS.CITIES, SEED_CITIES);
    return {
      ...newStop,
      city: cities.find(c => c.id === newStop.cityId)
    };
  },

  updateStop(tripId: number, stopId: number, updates: Partial<TripStop>): TripStop {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip || !trip.stops) throw new Error('Stop or Trip not found');

    const stopIndex = trip.stops.findIndex(s => s.id === Number(stopId));
    if (stopIndex === -1) throw new Error('Stop not found');

    trip.stops[stopIndex] = { ...trip.stops[stopIndex], ...updates };
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);
    return trip.stops[stopIndex];
  },

  deleteStop(tripId: number, stopId: number): void {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip || !trip.stops) return;

    trip.stops = trip.stops.filter(s => s.id !== Number(stopId));
    // Re-index remaining stops
    trip.stops.forEach((s, idx) => {
      s.stopOrder = idx + 1;
    });
    trip.destinationCount = trip.stops.length;
    trip.estimatedTotalCost = this.calculateTripTotalCost(trip);
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);
  },

  reorderStops(tripId: number, orderedStopIds: number[]): TripStop[] {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip || !trip.stops) throw new Error('Trip not found');

    const stopMap = new Map(trip.stops.map(s => [s.id, s]));
    const reordered: TripStop[] = [];

    orderedStopIds.forEach((id, idx) => {
      const stop = stopMap.get(id);
      if (stop) {
        stop.stopOrder = idx + 1;
        reordered.push(stop);
      }
    });

    // Append any unmentioned stops
    trip.stops.forEach(s => {
      if (!orderedStopIds.includes(s.id)) {
        s.stopOrder = reordered.length + 1;
        reordered.push(s);
      }
    });

    trip.stops = reordered;
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);
    return reordered;
  },

  // Activity to Stop Assignment
  assignActivity(tripId: number, stopId: number, activityData: { activityId: number; activityDate: string; startTime?: string; estimatedCost?: number; notes?: string }): TripActivity {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip || !trip.stops) throw new Error('Trip not found');

    const stop = trip.stops.find(s => s.id === Number(stopId));
    if (!stop) throw new Error('Trip stop not found');

    if (!stop.activities) stop.activities = [];

    const allActivities = getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES);
    const refActivity = allActivities.find(a => a.id === Number(activityData.activityId));
    const cost = activityData.estimatedCost !== undefined ? Number(activityData.estimatedCost) : (refActivity?.estimatedCost || 0);

    const newTripActivity: TripActivity = {
      id: Date.now(),
      tripStopId: Number(stopId),
      activityId: Number(activityData.activityId),
      activityDate: activityData.activityDate,
      startTime: activityData.startTime || '10:00:00',
      estimatedCost: cost,
      notes: activityData.notes || '',
      activityOrder: stop.activities.length + 1,
      category: 'ACTIVITIES',
    };

    stop.activities.push(newTripActivity);
    trip.estimatedTotalCost = this.calculateTripTotalCost(trip);
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);

    return {
      ...newTripActivity,
      activity: refActivity,
    };
  },

  updateTripActivity(tripId: number, tripActivityId: number, updates: Partial<TripActivity>): TripActivity {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip || !trip.stops) throw new Error('Trip not found');

    let updatedActivity: TripActivity | null = null;
    for (const stop of trip.stops) {
      if (stop.activities) {
        const actIndex = stop.activities.findIndex(a => a.id === Number(tripActivityId));
        if (actIndex !== -1) {
          stop.activities[actIndex] = { ...stop.activities[actIndex], ...updates };
          updatedActivity = stop.activities[actIndex];
          break;
        }
      }
    }

    if (!updatedActivity) throw new Error('Trip activity not found');
    trip.estimatedTotalCost = this.calculateTripTotalCost(trip);
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);
    return updatedActivity;
  },

  deleteTripActivity(tripId: number, tripActivityId: number): void {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip || !trip.stops) return;

    for (const stop of trip.stops) {
      if (stop.activities) {
        stop.activities = stop.activities.filter(a => a.id !== Number(tripActivityId));
      }
    }

    trip.estimatedTotalCost = this.calculateTripTotalCost(trip);
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);
  },

  // Structured Day-Wise Itinerary Resolver
  getItinerary(tripId: number): ItineraryViewResponse {
    const trip = this.getById(tripId);
    if (!trip) throw new Error('Trip not found');

    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const dayDiff = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const days: DayItinerary[] = [];
    const thresholdPerDay = (trip.budgetThreshold || 2500) / dayDiff;

    for (let i = 0; i < dayDiff; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];

      // Find which stop corresponds to this date
      const matchedStop = (trip.stops || []).find(stop => {
        return dateStr >= stop.startDate && dateStr <= stop.endDate;
      });

      const dayActivities: DayActivityItem[] = [];
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

      // Sort activities by time
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

  // Budget Engine & Summary
  getBudgetSummary(tripId: number): TripBudgetSummary {
    const trip = this.getById(tripId);
    if (!trip) throw new Error('Trip not found');

    const itinerary = this.getItinerary(tripId);
    const totalDays = itinerary.totalDays;
    const threshold = trip.budgetThreshold || 2500;
    const dailyThreshold = threshold / totalDays;

    const breakdown: Record<ExpenseCategory, number> = {
      TRANSPORT: 0,
      STAY: 0,
      ACTIVITIES: 0,
      MEALS: 0,
      OTHER: 0,
    };

    (trip.budgetExpenses || []).forEach(exp => {
      if (breakdown[exp.category] !== undefined) {
        breakdown[exp.category] += Number(exp.estimatedAmount || 0);
      }
    });

    // Activities cost calculated from stops
    let activityTotal = 0;
    (trip.stops || []).forEach(stop => {
      (stop.activities || []).forEach(act => {
        activityTotal += Number(act.estimatedCost || 0);
      });
    });
    breakdown.ACTIVITIES = activityTotal;

    const totalEstimatedCost = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const averageCostPerDay = Number((totalEstimatedCost / totalDays).toFixed(2));

    const dailyBreakdown = itinerary.days.map(d => ({
      date: d.date,
      cost: d.dayCost,
      isOverbudget: d.dayCost > dailyThreshold,
      dayIndex: d.dayIndex,
      city: d.city,
      activitiesCount: d.activities.length,
    }));

    const overbudgetDays: OverbudgetDay[] = itinerary.days
      .filter(d => d.dayCost > dailyThreshold)
      .map(d => ({
        date: d.date,
        dayCost: d.dayCost,
        dailyThreshold: Number(dailyThreshold.toFixed(2)),
        dayIndex: d.dayIndex,
        city: d.city,
        excess: Number((d.dayCost - dailyThreshold).toFixed(2)),
        alertMessage: `Daily spend of $${d.dayCost} exceeds recommended daily budget threshold ($${dailyThreshold.toFixed(2)}) by $${(d.dayCost - dailyThreshold).toFixed(2)}.`,
      }));

    return {
      tripId: trip.id,
      totalEstimatedCost,
      budgetThreshold: threshold,
      averageCostPerDay,
      averageDailyCost: averageCostPerDay,
      totalDays,
      categoryBreakdown: breakdown,
      dailyBreakdown,
      overbudgetDays,
    };
  },

  updateBudgetExpense(tripId: number, category: ExpenseCategory, amount: number, notes?: string): TripBudgetExpense[] {
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const trip = trips.find(t => t.id === Number(tripId));
    if (!trip) throw new Error('Trip not found');

    if (!trip.budgetExpenses) trip.budgetExpenses = [];
    const expIndex = trip.budgetExpenses.findIndex(e => e.category === category);
    
    if (expIndex !== -1) {
      trip.budgetExpenses[expIndex].estimatedAmount = amount;
      if (notes !== undefined) trip.budgetExpenses[expIndex].notes = notes;
    } else {
      trip.budgetExpenses.push({
        id: Date.now(),
        tripId: Number(tripId),
        category,
        estimatedAmount: amount,
        notes: notes || '',
      });
    }

    trip.estimatedTotalCost = this.calculateTripTotalCost(trip);
    trip.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.TRIPS, trips);
    return trip.budgetExpenses;
  },

  // Sharing & Public Read-Only / Cloning
  getShareToken(tripId: number): TripShareResponse {
    const trip = this.getById(tripId);
    if (!trip) throw new Error('Trip not found');

    if (!trip.shareToken) {
      trip.shareToken = `gt-shared-${trip.id}-${Math.random().toString(36).substring(2, 9)}`;
      this.update(tripId, { shareToken: trip.shareToken, isPublic: true });
    }

    // Increment public views
    const viewCounts = getStored<Record<string, number>>(STORAGE_KEYS.VIEWS, {});
    const views = (viewCounts[trip.shareToken] || 0) + 1;
    viewCounts[trip.shareToken] = views;
    setStored(STORAGE_KEYS.VIEWS, viewCounts);

    return {
      shareToken: trip.shareToken,
      publicUrl: `/shared/${trip.shareToken}`,
      isPublic: trip.isPublic ?? true,
      viewsCount: views,
    };
  },

  getByShareToken(shareToken: string): Trip | null {
    initLocalStorage();
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const matched = trips.find(t => t.shareToken === shareToken);
    if (!matched) return null;
    return this.getById(matched.id);
  },

  copyTrip(shareToken: string): Trip {
    const original = this.getByShareToken(shareToken);
    if (!original) throw new Error('Shared trip not found');

    const currentUser = AuthStorage.getCurrentUser();
    if (!currentUser) throw new Error('Must be logged in to copy trip');

    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const newTripId = Date.now();

    // Deep clone stops and activities
    const clonedStops: TripStop[] = (original.stops || []).map((stop, sIdx) => {
      const newStopId = Date.now() + (sIdx + 1) * 100;
      const clonedActivities: TripActivity[] = (stop.activities || []).map((act, aIdx) => ({
        ...act,
        id: newStopId + aIdx + 1,
        tripStopId: newStopId,
      }));

      return {
        ...stop,
        id: newStopId,
        tripId: newTripId,
        activities: clonedActivities,
      };
    });

    const clonedBudgetExpenses: TripBudgetExpense[] = (original.budgetExpenses || []).map((exp, eIdx) => ({
      ...exp,
      id: Date.now() + (eIdx + 1) * 10,
      tripId: newTripId,
    }));

    const clonedTrip: Trip = {
      ...original,
      id: newTripId,
      userId: currentUser.id,
      name: `${original.name} (Copy)`,
      shareToken: `gt-shared-${newTripId}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stops: clonedStops,
      budgetExpenses: clonedBudgetExpenses,
    };

    trips.unshift(clonedTrip);
    setStored(STORAGE_KEYS.TRIPS, trips);
    return clonedTrip;
  }
};

// ----------------- ADMIN ANALYTICS STORAGE -----------------
export const AdminStorage = {
  getAnalytics(): AdminAnalytics {
    initLocalStorage();
    const users = getStored<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
    const trips = getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS);
    const cities = getStored<City[]>(STORAGE_KEYS.CITIES, SEED_CITIES);
    const activities = getStored<Activity[]>(STORAGE_KEYS.ACTIVITIES, SEED_ACTIVITIES);

    let totalDestinationsBooked = 0;
    let totalActivitiesScheduled = 0;
    let totalEstimatedSpend = 0;
    const cityVisitMap: Record<number, number> = {};
    const activityCountMap: Record<number, number> = {};

    trips.forEach(t => {
      totalEstimatedSpend += (t.estimatedTotalCost || 0);
      (t.stops || []).forEach(s => {
        totalDestinationsBooked++;
        cityVisitMap[s.cityId] = (cityVisitMap[s.cityId] || 0) + 1;
        (s.activities || []).forEach(a => {
          totalActivitiesScheduled++;
          activityCountMap[a.activityId] = (activityCountMap[a.activityId] || 0) + 1;
        });
      });
    });

    const topCities = cities.map(c => ({
      city: c.name,
      country: c.country,
      visitCount: (cityVisitMap[c.id] || 0) + Math.floor(c.popularity / 10),
      popularity: c.popularity,
      imageUrl: c.imageUrl,
    })).sort((a, b) => b.visitCount - a.visitCount).slice(0, 5);

    const topActivities = activities.map(a => {
      const city = cities.find(c => c.id === a.cityId);
      return {
        name: a.name,
        type: a.type,
        count: (activityCountMap[a.id] || 0) + Math.floor(Math.random() * 8) + 3,
        cityName: city?.name || 'Global',
      };
    }).sort((a, b) => b.count - a.count).slice(0, 6);

    const regionalDistribution = [
      { region: 'Europe', count: 18, percentage: 42 },
      { region: 'Asia', count: 14, percentage: 33 },
      { region: 'Americas', count: 7, percentage: 16 },
      { region: 'Oceania & Africa', count: 4, percentage: 9 },
    ];

    const dailyTripCreationTrend = [
      { date: 'Mon', count: 12 },
      { date: 'Tue', count: 19 },
      { date: 'Wed', count: 24 },
      { date: 'Thu', count: 32 },
      { date: 'Fri', count: 45 },
      { date: 'Sat', count: 58 },
      { date: 'Sun', count: 48 },
    ];

    return {
      totalUsers: users.length + 148,
      totalTrips: trips.length + 312,
      totalDestinationsBooked: totalDestinationsBooked + 740,
      totalActivitiesScheduled: totalActivitiesScheduled + 1890,
      totalEstimatedSpend: totalEstimatedSpend + 524000,
      topCities,
      topActivities,
      regionalDistribution,
      dailyTripCreationTrend,
    };
  }
};
