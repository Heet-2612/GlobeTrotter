import api from './api';
import { BudgetSummaryResponse } from '../types';

export const budgetService = {
  async getBudgetSummary(tripId: number): Promise<BudgetSummaryResponse> {
    return api.get<BudgetSummaryResponse>(`/trips/${tripId}/budget`, { requiresAuth: true });
  },

  async setTripBudget(tripId: number, budget: number): Promise<BudgetSummaryResponse> {
    return api.put<BudgetSummaryResponse>(`/trips/${tripId}/budget`, { budget }, { requiresAuth: true });
  }
};

export default budgetService;
