import api from './client';
import type { DashboardSummary, CategoryBreakdown, TrendDataItem } from '../types/dashboard';

export const dashboardService = {
  getSummary: async (): Promise<{ success: boolean; data: DashboardSummary }> => {
    const { data } = await api.get('/dashboard/summary');
    return data;
  },

  getCategoryBreakdown: async (): Promise<{ success: boolean; data: CategoryBreakdown[] }> => {
    const { data } = await api.get('/dashboard/category-breakdown');
    return data;
  },

  getTrends: async (months: number = 6): Promise<{ success: boolean; data: TrendDataItem[] }> => {
    const { data } = await api.get(`/dashboard/trends?months=${months}`);
    return data;
  },

  getRecentActivity: async (limit: number = 10): Promise<{ success: boolean; data: any[] }> => {
    const { data } = await api.get(`/dashboard/recent?limit=${limit}`);
    return data;
  },

  getMySummary: async (): Promise<{ success: boolean; data: DashboardSummary }> => {
    const { data } = await api.get('/dashboard/my-summary');
    return data;
  }
};
