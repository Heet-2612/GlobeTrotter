import api from './api';
import { City, Activity, Country } from '../types';
import { SEED_COUNTRIES } from '../data/seedData';

export const cityService = {
  getApiKey(): string {
    return '';
  },

  getApiHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  },

  async getCountries(params?: { search?: string; region?: string }): Promise<Country[]> {
    let list = SEED_COUNTRIES;
    if (params?.search) {
      const query = params.search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query));
    }
    if (params?.region) {
      list = list.filter(c => c.region.toLowerCase() === params.region!.toLowerCase());
    }
    return list;
  },

  async getCountryByCode(code: string): Promise<Country | null> {
    const country = SEED_COUNTRIES.find(c => c.code.toLowerCase() === code.toLowerCase());
    return country || null;
  },

  async getCities(params?: { 
    search?: string; 
    query?: string;
    country?: string; 
    region?: string; 
    maxCostIndex?: number;
  }): Promise<City[]> {
    const searchQuery = params?.query || params?.search || '';
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('search', searchQuery);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.region) queryParams.append('region', params.region);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/cities?${queryString}` : '/cities';
    
    let cities = await api.get<City[]>(endpoint, { requiresAuth: false });
    
    if (params?.maxCostIndex !== undefined && Array.isArray(cities)) {
      cities = cities.filter(c => c.costIndex <= params.maxCostIndex!);
    }
    
    return cities || [];
  },

  async getCityById(cityId: number): Promise<City | null> {
    return api.get<City>(`/cities/${cityId}`, { requiresAuth: false });
  },

  async getActivitiesForCity(cityId: number, filters?: { category?: string; type?: string; maxCost?: number; search?: string }): Promise<Activity[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('cityId', cityId.toString());
    
    const search = filters?.search;
    const category = filters?.category || filters?.type;
    
    if (search) queryParams.append('search', search);
    if (category) queryParams.append('category', category);

    let activities = await api.get<Activity[]>(`/activities?${queryParams.toString()}`, { requiresAuth: false });
    if (filters?.maxCost !== undefined && Array.isArray(activities)) {
      activities = activities.filter(a => a.estimatedCost <= filters.maxCost!);
    }
    return activities || [];
  },

  async getCityActivities(cityId: number, filters?: { category?: string; type?: string; maxCost?: number; search?: string }): Promise<Activity[]> {
    return this.getActivitiesForCity(cityId, filters);
  },

  async getActivities(filters?: { 
    search?: string; 
    query?: string;
    cityId?: number; 
    category?: string; 
    type?: string; 
    maxCost?: number;
  }): Promise<Activity[]> {
    const queryParams = new URLSearchParams();
    const search = filters?.query || filters?.search;
    const category = filters?.category || filters?.type;

    if (filters?.cityId) queryParams.append('cityId', filters.cityId.toString());
    if (search) queryParams.append('search', search);
    if (category) queryParams.append('category', category);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/activities?${queryString}` : '/activities';

    let activities = await api.get<Activity[]>(endpoint, { requiresAuth: false });
    if (filters?.maxCost !== undefined && Array.isArray(activities)) {
      activities = activities.filter(a => a.estimatedCost <= filters.maxCost!);
    }
    return activities || [];
  },

  async getAllActivities(filters?: { category?: string; type?: string; maxCost?: number; search?: string }): Promise<Activity[]> {
    return this.getActivities(filters);
  }
};

export default cityService;
