import { AdminStorage } from './storage';
import { AdminMetrics } from '../types';
import { 
  SEED_USERS, SEED_CITIES, SEED_ACTIVITIES, 
  INITIAL_TRIPS, INITIAL_SAVED_DESTINATIONS, SEED_COUNTRIES 
} from '../data/seedData';

export const adminService = {
  async getMetrics(): Promise<AdminMetrics> {
    await new Promise(r => setTimeout(r, 60));
    const analytics = AdminStorage.getAnalytics();
    
    // Map to AdminMetrics structure
    const topCities = analytics.topCities.map((c, idx) => ({
      cityId: idx + 1,
      cityName: c.city,
      country: c.country,
      tripCount: c.visitCount,
      popularity: c.popularity,
    }));

    const topActivities = analytics.topActivities.map((a, idx) => ({
      activityId: idx + 1,
      activityName: a.name,
      type: a.type,
      scheduledCount: a.count,
    }));

    return {
      totalUsers: analytics.totalUsers,
      totalTrips: analytics.totalTrips,
      totalStops: analytics.totalDestinationsBooked,
      totalRevenueEstimate: analytics.totalEstimatedSpend,
      topCities,
      topActivities,
    };
  },

  async resetData(): Promise<void> {
    await new Promise(r => setTimeout(r, 80));
    localStorage.setItem('gt_users', JSON.stringify(SEED_USERS));
    localStorage.setItem('gt_countries', JSON.stringify(SEED_COUNTRIES));
    localStorage.setItem('gt_cities', JSON.stringify(SEED_CITIES));
    localStorage.setItem('gt_activities', JSON.stringify(SEED_ACTIVITIES));
    localStorage.setItem('gt_trips', JSON.stringify(INITIAL_TRIPS));
    localStorage.setItem('gt_saved_destinations', JSON.stringify(INITIAL_SAVED_DESTINATIONS));
    localStorage.setItem('gt_current_user', JSON.stringify(SEED_USERS[0]));
    localStorage.removeItem('globetrotter_expenses');
  }
};

