export interface UserResponse {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
  languagePreference?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface TripResponse {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  budget?: number;
  isPublic: boolean;
  shareToken?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTripRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  budget?: number;
}

export interface UpdateTripRequest {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  budget?: number;
}

export type DestinationType =
  | 'CITY' | 'TOWN' | 'REGION_CLUSTER' | 'ISLAND_ARCHIPELAGO'
  | 'NATIONAL_PARK' | 'HERITAGE_SITE' | 'PILGRIMAGE' | 'HILL_STATION'
  | 'BEACH' | 'CIRCUIT' | 'OTHER';

export type DestinationSource = 'CURATED' | 'GEOAPIFY' | 'USER_CREATED';

export interface RegionResponse {
  id: number;
  name: string;
  canonicalName: string;
  country: string;
  description?: string;
  imageUrl?: string;
}

export interface DestinationResponse {
  id: number;
  name: string;
  canonicalName?: string;
  country: string;
  regionId?: number;
  regionName?: string;
  region?: string;
  destinationType?: DestinationType;
  source?: DestinationSource;
  isCurated?: boolean;
  costIndex?: number;
  popularity?: number;
  imageUrl?: string;
  currencyCode?: string;
  currencySymbol?: string;
  latitude?: number;
  longitude?: number;
  aliases?: string[];
}

export type CityResponse = DestinationResponse;

export interface TripStopResponse {
  id: number;
  tripId: number;
  destination?: DestinationResponse;
  city: CityResponse;
  stopOrder: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CreateTripStopRequest {
  destinationId?: number;
  cityId: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface ActivityResponse {
  id: number;
  destinationId?: number;
  destinationName?: string;
  cityId?: number;
  cityName?: string;
  name: string;
  description?: string;
  category?: string;
  estimatedDurationMinutes?: number;
  estimatedCost?: number;
  currency?: string;
  imageUrl?: string;
  googlePlaceId?: string;
}

export interface TripActivityResponse {
  id: number;
  tripStopId: number;
  activity: ActivityResponse;
  scheduledDate: string;
  startTime?: string;
  notes?: string;
  customCost?: number;
  activityOrder: number;
}

export interface CreateTripActivityRequest {
  activityId: number;
  scheduledDate: string;
  startTime?: string;
  notes?: string;
  customCost?: number;
}

export interface CategoryCostSummary {
  category: string;
  totalCost: number;
  count: number;
}

export interface BudgetSummaryResponse {
  tripId: number;
  budget: number;
  totalActivityCost: number;
  remainingBudget: number;
  budgetUsedPercentage: number;
  budgetExceeded: boolean;
  currency: string;
  categoryBreakdown: CategoryCostSummary[];
}

export interface SetBudgetRequest {
  budget: number;
}

export interface TripSharingResponse {
  tripId: number;
  isPublic: boolean;
  shareToken?: string;
  publicUrl?: string;
}

export interface UpdateSharingRequest {
  isPublic: boolean;
}

export interface PublicTripActivityResponse {
  id: number;
  name: string;
  category: string;
  scheduledDate: string;
  startTime?: string;
  cost: number;
  currency: string;
}

export interface PublicTripStopResponse {
  id: number;
  cityName: string;
  country: string;
  startDate: string;
  endDate: string;
  notes?: string;
  activities: PublicTripActivityResponse[];
}

export interface PublicTripItineraryResponse {
  tripId: number;
  shareToken: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  creatorName: string;
  budget?: number;
  stops: PublicTripStopResponse[];
}

export interface PlaceResponse {
  placeId: string;
  name: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  googleMapsUri?: string;
  primaryType?: string;
  photoUrl?: string;
}

export interface PlaceAutocompleteResponse {
  placeId: string;
  text: string;
  secondaryText?: string;
}

export interface ExchangeRateResponse {
  baseCode: string;
  rates: Record<string, number>;
  lastUpdated: string;
  live?: boolean;
  source?: string;
}
