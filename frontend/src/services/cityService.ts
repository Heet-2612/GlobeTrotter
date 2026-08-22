import { api } from './api';
import { City, Activity, Country } from '../types';
import { CountryStorage, COUNTRIES_CITIES_API_KEY } from './storage';

export const cityService = {
  getApiKey(): string {
    return COUNTRIES_CITIES_API_KEY;
  },

  getApiHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${COUNTRIES_CITIES_API_KEY}`,
      'X-API-KEY': COUNTRIES_CITIES_API_KEY,
      'Content-Type': 'application/json',
    };
  },

  async getCountries(params?: { search?: string; region?: string }): Promise<Country[]> {
    return CountryStorage.getAll(params);
  },

  async getCountryByCode(code: string): Promise<Country | null> {
    return CountryStorage.getByCode(code);
  },

  async getCities(params?: { 
    search?: string; 
    query?: string;
    country?: string; 
    region?: string; 
    maxCostIndex?: number;
  }): Promise<City[]> {
    const search = params?.query || params?.search;
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.region) queryParams.append('region', params.region);
    
    const qs = queryParams.toString();
    const url = `/cities${qs ? `?${qs}` : ''}`;
    let list = await api.get<City[]>(url);
    
    if (params?.maxCostIndex !== undefined) {
      list = list.filter(c => c.costIndex <= params.maxCostIndex!);
    }
    return list;
  },

  async getCityById(cityId: number): Promise<City | null> {
    try {
      return await api.get<City>(`/cities/${cityId}`);
    } catch {
      return null;
    }
  },

  async getActivitiesForCity(cityId: number, filters?: { type?: string; maxCost?: number; maxDuration?: number }): Promise<Activity[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('cityId', cityId.toString());
    
    const qs = queryParams.toString();
    const url = `/activities?${qs}`;
    let list = await api.get<Activity[]>(url);
    
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

  async getCityActivities(cityId: number, filters?: { type?: string; maxCost?: number; maxDuration?: number }): Promise<Activity[]> {
    return this.getActivitiesForCity(cityId, filters);
  },

  async getActivities(filters?: { 
    search?: string; 
    query?: string;
    cityId?: number; 
    category?: string; 
    type?: string; 
    maxCost?: number; 
    maxDuration?: number 
  }): Promise<Activity[]> {
    const search = filters?.query || filters?.search;
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (filters?.cityId) queryParams.append('cityId', filters.cityId.toString());
    const cat = filters?.category || filters?.type;
    if (cat && cat !== 'ALL') queryParams.append('category', cat);
    
    const qs = queryParams.toString();
    const url = `/activities${qs ? `?${qs}` : ''}`;
    let list = await api.get<Activity[]>(url);
    
    if (filters?.maxCost !== undefined && filters.maxCost > 0) {
      list = list.filter(a => a.estimatedCost <= (filters.maxCost ?? 9999));
    }
    if (filters?.maxDuration !== undefined && filters.maxDuration > 0) {
      list = list.filter(a => a.durationMin <= (filters.maxDuration ?? 9999));
    }
    return list;
  },

  async getAllActivities(filters?: { type?: string; maxCost?: number; maxDuration?: number; search?: string }): Promise<Activity[]> {
    return this.getActivities(filters);
  }
};
