import { AdminMetrics } from '../types';

export const adminService = {
  async getMetrics(): Promise<AdminMetrics> {
    return {
      totalUsers: 0,
      totalTrips: 0,
      totalStops: 0,
      totalRevenueEstimate: 0,
      topCities: [],
      topActivities: [],
    };
  },

  async resetData(): Promise<void> {
    console.warn('Admin reset data is not supported in production backend mode.');
  }
};

export default adminService;
