import { CityStorage, CountryStorage, COUNTRIES_CITIES_API_KEY } from './storage';
import { City, Activity, Country } from '../types';

export const cityService = {
  // Configured API Key for Country & City operations
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
    await new Promise(r => setTimeout(r, 40));
    return CountryStorage.getAll(params);
  },

  async getCountryByCode(code: string): Promise<Country | null> {
    await new Promise(r => setTimeout(r, 40));
    return CountryStorage.getByCode(code);
  },

  async getCities(params?: { 
    search?: string; 
    query?: string;
    country?: string; 
    region?: string; 
    maxCostIndex?: number;
  }): Promise<City[]> {
    await new Promise(r => setTimeout(r, 60));
    const searchQuery = params?.query || params?.search;
    let list = CityStorage.getAll({
      search: searchQuery,
      country: params?.country,
      region: params?.region,
    });
    if (params?.maxCostIndex !== undefined) {
      list = list.filter(c => c.costIndex <= params.maxCostIndex!);
    }
    return list;
  },

  async getCityById(cityId: number): Promise<City | null> {
    await new Promise(r => setTimeout(r, 50));
    return CityStorage.getById(cityId);
  },

  async getActivitiesForCity(cityId: number, filters?: { type?: string; maxCost?: number; maxDuration?: number }): Promise<Activity[]> {
    await new Promise(r => setTimeout(r, 60));
    return CityStorage.getActivitiesForCity(cityId, filters);
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
    await new Promise(r => setTimeout(r, 60));
    const cat = filters?.category || filters?.type;
    const search = filters?.query || filters?.search;
    return CityStorage.getAllActivities({
      search,
      cityId: filters?.cityId,
      type: cat,
      maxCost: filters?.maxCost,
      maxDuration: filters?.maxDuration,
    });
  },

  async getAllActivities(filters?: { type?: string; maxCost?: number; maxDuration?: number; search?: string }): Promise<Activity[]> {
    return this.getActivities(filters);
  }
};

