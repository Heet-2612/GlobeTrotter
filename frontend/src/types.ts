export type ActivityType = 
  | 'SIGHTSEEING' 
  | 'FOOD_TOUR' 
  | 'ADVENTURE' 
  | 'CULTURE' 
  | 'RELAXATION' 
  | 'ENTERTAINMENT';

export type ExpenseCategory = 
  | 'TRANSPORT' 
  | 'STAY' 
  | 'ACTIVITIES' 
  | 'MEALS' 
  | 'OTHER';

export interface User {
  id: number;
  email: string;
  name: string;
  profilePhoto?: string | null;
  languagePreference: string;
  savedDestinationsCount?: number;
  role?: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface City {
  id: number;
  name: string;
  country: string;
  region: string;
  costIndex: number; // 1.0 to 5.0
  popularity: number; // 1 to 100
  imageUrl: string;
  description?: string;
  currency?: string;
  timezone?: string;
  tagline?: string;
}

export interface Activity {
  id: number;
  cityId: number;
  name: string;
  description: string;
  type: ActivityType;
  estimatedCost: number;
  durationMin: number;
  imageUrl: string;
  rating?: number;
  location?: string;
}

export interface TripActivity {
  id: number;
  tripStopId: number;
  activityId: number;
  activity?: Activity;
  activityDate: string; // YYYY-MM-DD
  startTime?: string; // HH:MM:SS
  estimatedCost: number;
  notes?: string;
  activityOrder: number;
  category?: ExpenseCategory;
}

export interface TripStop {
  id: number;
  tripId: number;
  cityId: number;
  city?: City;
  stopOrder: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  notes?: string;
  activities?: TripActivity[];
}

export interface TripBudgetExpense {
  id: number;
  tripId: number;
  category: ExpenseCategory;
  estimatedAmount: number;
  notes?: string;
}

export interface Trip {
  id: number;
  userId: number;
  name: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coverPhoto?: string;
  destinationCount?: number;
  estimatedTotalCost?: number;
  budgetThreshold?: number;
  isPublic?: boolean;
  shareToken?: string;
  stops?: TripStop[];
  budgetExpenses?: TripBudgetExpense[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DayActivityItem {
  tripActivityId: number;
  activityId: number;
  name: string;
  type: ActivityType;
  time?: string;
  durationMin: number;
  cost: number;
  imageUrl?: string;
  notes?: string;
  cityId?: number;
  cityName?: string;
}

export interface DayItinerary {
  date: string;
  dayIndex: number;
  stopId?: number;
  city?: string;
  cityDetails?: City;
  activities: DayActivityItem[];
  dayCost: number;
  isOverbudget?: boolean;
}

export interface ItineraryViewResponse {
  tripId: number;
  tripName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  days: DayItinerary[];
}

export interface OverbudgetDay {
  date: string;
  dayCost: number;
  dailyThreshold: number;
  alertMessage: string;
  dayIndex?: number;
  city?: string;
  excess: number;
}

export interface TripBudgetSummary {
  tripId: number;
  totalEstimatedCost: number;
  budgetThreshold: number;
  averageCostPerDay: number;
  totalDays: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  dailyBreakdown: { date: string; cost: number; isOverbudget: boolean; dayIndex: number; city?: string; activitiesCount: number }[];
  overbudgetDays: OverbudgetDay[];
  averageDailyCost?: number;
}

export interface TripShareResponse {
  shareToken: string;
  publicUrl: string;
  isPublic: boolean;
  viewsCount?: number;
}

export interface SharedTripResponse {
  trip: Trip;
  owner: {
    id: number;
    name: string;
    email: string;
    profilePhoto?: string | null;
  };
  itinerary: ItineraryViewResponse;
  isPublic: boolean;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalTrips: number;
  totalDestinationsBooked: number;
  totalActivitiesScheduled: number;
  totalEstimatedSpend: number;
  topCities: { city: string; country: string; visitCount: number; popularity: number; imageUrl: string }[];
  topActivities: { name: string; type: ActivityType; count: number; cityName: string }[];
  regionalDistribution: { region: string; count: number; percentage: number }[];
  dailyTripCreationTrend: { date: string; count: number }[];
}

export interface AdminMetrics {
  totalUsers: number;
  totalTrips: number;
  totalStops: number;
  totalRevenueEstimate: number;
  topCities: {
    cityId: number;
    cityName: string;
    country: string;
    tripCount: number;
    popularity: number;
  }[];
  topActivities: {
    activityId: number;
    activityName: string;
    type: string;
    scheduledCount: number;
  }[];
}

export interface Country {
  code: string;
  name: string;
  region: string;
  flagEmoji: string;
  currency: string;
  capital: string;
  language: string;
  citiesCount: number;
  featuredImageUrl?: string;
  description?: string;
}
