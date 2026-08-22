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
  languagePreference?: string;
  savedDestinationsCount?: number;
  role?: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface City {
  id: number;
  name: string;
  country: string;
  region: string;
  costIndex: number;
  popularity: number;
  imageUrl?: string | null;
  description?: string;
  currency?: string;
  timezone?: string;
  tagline?: string;
}

export interface Activity {
  id: number;
  cityId?: number;
  name: string;
  description?: string | null;
  category?: string;
  type?: ActivityType;
  estimatedDurationMinutes?: number;
  durationMin?: number;
  estimatedCost: number;
  currency?: string;
  imageUrl?: string | null;
  rating?: number;
  location?: string;
}

export interface TripActivity {
  id: number;
  tripStopId?: number;
  activityId?: number;
  activity?: Activity;
  scheduledDate?: string; // YYYY-MM-DD
  activityDate?: string; // YYYY-MM-DD
  startTime?: string | null; // HH:MM:SS
  customCost?: number | null;
  estimatedCost?: number;
  notes?: string | null;
  activityOrder: number;
  category?: ExpenseCategory;
}

export interface TripStop {
  id: number;
  tripId: number;
  cityId?: number;
  city?: City;
  stopOrder: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  notes?: string | null;
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
  userId?: number;
  name: string;
  description?: string | null;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  coverPhoto?: string | null;
  budget?: number | null;
  budgetThreshold?: number | null;
  destinationCount?: number;
  estimatedTotalCost?: number;
  isPublic?: boolean;
  shareToken?: string | null;
  stops?: TripStop[];
  budgetExpenses?: TripBudgetExpense[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryCostSummary {
  category: string;
  cost: number;
  activityCount: number;
}

export interface BudgetSummaryResponse {
  tripId: number;
  budget?: number | null;
  totalActivityCost: number;
  remainingBudget?: number | null;
  budgetUsedPercentage?: number | null;
  budgetExceeded?: boolean;
  currency: string;
  categoryBreakdown: CategoryCostSummary[];
}

export interface TripSharingResponse {
  tripId: number;
  isPublic: boolean;
  shareToken?: string | null;
  publicUrl?: string | null;
}

export interface PublicTripActivity {
  tripActivityId: number;
  activityName: string;
  category: string;
  description?: string | null;
  durationMinutes: number;
  cost: number;
  scheduledDate: string;
  startTime?: string | null;
  notes?: string | null;
  activityOrder: number;
}

export interface PublicTripStop {
  stopId: number;
  city: City;
  startDate: string;
  endDate: string;
  stopOrder: number;
  notes?: string | null;
  activities: PublicTripActivity[];
}

export interface PublicTripItineraryResponse {
  tripId: number;
  shareToken: string;
  name: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverPhoto?: string | null;
  creatorName: string;
  budget?: number | null;
  stops: PublicTripStop[];
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
  categoryBreakdown: Record<string, number>;
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

export interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
}
