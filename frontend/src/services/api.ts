import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  UserResponse,
  TripResponse,
  CreateTripRequest,
  UpdateTripRequest,
  CityResponse,
  DestinationResponse,
  RegionResponse,
  TripStopResponse,
  CreateTripStopRequest,
  ActivityResponse,
  TripActivityResponse,
  CreateTripActivityRequest,
  BudgetSummaryResponse,
  SetBudgetRequest,
  TripSharingResponse,
  UpdateSharingRequest,
  PublicTripItineraryResponse,
  PlaceResponse,
  PlaceAutocompleteResponse,
  ExchangeRateResponse,
  DiscoveredPlaceResponse,
  AddDiscoveredActivityRequest,
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('globetrotter_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (!endpoint.startsWith('/auth/')) {
      localStorage.removeItem('globetrotter_token');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
  }

  if (!response.ok) {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    const message = errorData.message || errorData.error || 'An unexpected error occurred.';
    throw new ApiError(response.status, message, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  if (!text || text.trim() === '') {
    return {} as T;
  }

  return JSON.parse(text) as T;
}

export const api = {
  // Auth
  login: (data: LoginRequest) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  exchangeOAuth2Code: (code: string) =>
    request<AuthResponse>('/auth/oauth2/exchange', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  signup: (data: SignupRequest) =>
    request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: ForgotPasswordRequest) =>
    request<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: ResetPasswordRequest) =>
    request<ForgotPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getCurrentUser: () => request<UserResponse>('/users/me'),

  // Health
  checkHealth: () => request<{ status: string; service: string }>('/health'),

  // Trips
  getTrips: () => request<TripResponse[]>('/trips'),
  getTripById: (tripId: number) => request<TripResponse>(`/trips/${tripId}`),
  createTrip: (data: CreateTripRequest) =>
    request<TripResponse>('/trips', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTrip: (tripId: number, data: UpdateTripRequest) =>
    request<TripResponse>(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTrip: (tripId: number) =>
    request<void>(`/trips/${tripId}`, {
      method: 'DELETE',
    }),

  // Regions (NEW V2)
  getRegions: () => request<RegionResponse[]>('/regions'),
  getRegionById: (id: number) => request<RegionResponse>(`/regions/${id}`),

  // Destinations (NEW V2)
  searchDestinations: (query?: string, country?: string, region?: string, regionId?: number, curated?: boolean) => {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (country) params.append('country', country);
    if (region) params.append('region', region);
    if (regionId) params.append('regionId', String(regionId));
    if (curated !== undefined) params.append('curated', String(curated));
    const queryString = params.toString();
    return request<DestinationResponse[]>(`/destinations${queryString ? `?${queryString}` : ''}`);
  },
  getDestinationById: (id: number) => request<DestinationResponse>(`/destinations/${id}`),
  discoverPlacesByDestination: (destinationId: number, query?: string, category?: string, radius?: number) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    if (radius) params.append('radius', radius.toString());
    const queryString = params.toString();
    return request<DiscoveredPlaceResponse[]>(`/destinations/${destinationId}/discover${queryString ? `?${queryString}` : ''}`);
  },

  // Cities (Deprecated V1 Alias for Destinations)
  searchCities: (query?: string, country?: string, region?: string, curated?: boolean) => {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (country) params.append('country', country);
    if (region) params.append('region', region);
    if (curated !== undefined) params.append('curated', String(curated));
    const queryString = params.toString();
    return request<CityResponse[]>(`/cities${queryString ? `?${queryString}` : ''}`);
  },
  getCityById: (cityId: number) => request<CityResponse>(`/cities/${cityId}`),

  // Stops
  getTripStops: (tripId: number) => request<TripStopResponse[]>(`/trips/${tripId}/stops`),
  createTripStop: (tripId: number, data: CreateTripStopRequest) =>
    request<TripStopResponse>(`/trips/${tripId}/stops`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addTripStop: (tripId: number, data: CreateTripStopRequest) =>
    request<TripStopResponse>(`/trips/${tripId}/stops`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTripStop: (tripId: number, stopId: number, data: Partial<CreateTripStopRequest>) =>
    request<TripStopResponse>(`/trips/${tripId}/stops/${stopId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTripStop: (tripId: number, stopId: number) =>
    request<void>(`/trips/${tripId}/stops/${stopId}`, {
      method: 'DELETE',
    }),
  reorderTripStops: (tripId: number, stopIds: number[]) =>
    request<TripStopResponse[]>(`/trips/${tripId}/stops/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ stopIds }),
    }),

  // Activities
  searchActivities: (cityId?: number, search?: string, category?: string, destinationId?: number, source?: string) => {
    const params = new URLSearchParams();
    const targetDestId = destinationId || cityId;
    if (targetDestId) params.append('destinationId', targetDestId.toString());
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (source) params.append('source', source);
    const queryString = params.toString();
    return request<ActivityResponse[]>(`/activities${queryString ? `?${queryString}` : ''}`);
  },
  getCuratedActivitiesByDestination: (destinationId: number) =>
    request<ActivityResponse[]>(`/destinations/${destinationId}/activities/curated`),
  getActivitiesByDestination: (destinationId: number) =>
    request<ActivityResponse[]>(`/destinations/${destinationId}/activities`),
  getActivityById: (activityId: number) => request<ActivityResponse>(`/activities/${activityId}`),

  // Trip Activities
  getTripActivities: (tripId: number, stopId?: number) => {
    if (stopId) {
      return request<TripActivityResponse[]>(`/trips/${tripId}/stops/${stopId}/activities`);
    }
    return request<TripActivityResponse[]>(`/trips/${tripId}/activities`);
  },
  createTripActivity: (tripId: number, stopId: number, data: CreateTripActivityRequest) =>
    request<TripActivityResponse>(`/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addTripActivity: (tripId: number, stopId: number, data: CreateTripActivityRequest) =>
    request<TripActivityResponse>(`/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  addDiscoveredActivityToStop: (tripId: number, stopId: number, data: AddDiscoveredActivityRequest) =>
    request<TripActivityResponse>(`/trips/${tripId}/stops/${stopId}/activities/discovered`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTripActivity: (tripId: number, stopId: number, tripActivityId: number, data: Partial<CreateTripActivityRequest>) =>
    request<TripActivityResponse>(`/trips/${tripId}/stops/${stopId}/activities/${tripActivityId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTripActivity: (tripId: number, stopIdOrActivityId: number, tripActivityId?: number) => {
    if (tripActivityId !== undefined) {
      return request<void>(`/trips/${tripId}/stops/${stopIdOrActivityId}/activities/${tripActivityId}`, {
        method: 'DELETE',
      });
    }
    return request<void>(`/trips/${tripId}/activities/${stopIdOrActivityId}`, {
      method: 'DELETE',
    });
  },
  reorderTripActivities: (tripId: number, stopId: number, tripActivityIds: number[]) =>
    request<TripActivityResponse[]>(`/trips/${tripId}/stops/${stopId}/activities/reorder`, {
      method: 'PUT',
      body: JSON.stringify({ tripActivityIds }),
    }),

  // Budget
  getBudgetSummary: (tripId: number) => request<BudgetSummaryResponse>(`/trips/${tripId}/budget`),
  getTripBudget: (tripId: number) => request<BudgetSummaryResponse>(`/trips/${tripId}/budget`),
  updateBudget: (tripId: number, data: SetBudgetRequest) =>
    request<BudgetSummaryResponse>(`/trips/${tripId}/budget`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  setTripBudget: (tripId: number, data: SetBudgetRequest) =>
    request<BudgetSummaryResponse>(`/trips/${tripId}/budget`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Sharing
  getSharingStatus: (tripId: number) => request<TripSharingResponse>(`/trips/${tripId}/sharing`),
  getTripSharing: (tripId: number) => request<TripSharingResponse>(`/trips/${tripId}/share`),
  updateSharing: (tripId: number, data: UpdateSharingRequest) =>
    request<TripSharingResponse>(`/trips/${tripId}/sharing`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  updateTripSharing: (tripId: number, data: UpdateSharingRequest) =>
    request<TripSharingResponse>(`/trips/${tripId}/share`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getPublicTrip: (shareToken: string) =>
    request<PublicTripItineraryResponse>(`/public/trips/${shareToken}`),
  copyPublicTrip: (shareToken: string) =>
    request<TripResponse>(`/public/trips/${shareToken}/copy`, {
      method: 'POST',
    }),

  // Google Places API
  searchPlaces: (city: string, query?: string, category?: string) => {
    const params = new URLSearchParams();
    params.append('city', city);
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    return request<PlaceResponse[]>(`/places/search?${params.toString()}`);
  },
  getPlaceAutocomplete: (input: string, city?: string) => {
    const params = new URLSearchParams();
    params.append('input', input);
    if (city) params.append('city', city);
    return request<PlaceAutocompleteResponse[]>(`/places/autocomplete?${params.toString()}`);
  },
  autocompletePlaces: (input: string) => {
    const params = new URLSearchParams({ input });
    return request<PlaceAutocompleteResponse[]>(`/places/autocomplete?${params.toString()}`);
  },
  getPlaceDetails: (placeId: string) => request<PlaceResponse>(`/places/${placeId}`),
  convertPlaceToActivity: (cityId: number, place: PlaceResponse) =>
    request<ActivityResponse>(`/places/convert-to-activity?cityId=${cityId}`, {
      method: 'POST',
      body: JSON.stringify(place),
    }),

  // Exchange Rates
  getExchangeRates: (baseCurrency: string = 'INR') => request<ExchangeRateResponse>(`/currency/rates?base=${baseCurrency}`),
};
