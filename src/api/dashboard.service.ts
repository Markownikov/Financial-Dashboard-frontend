import api from './client';

export const dashboardService = {
  getSummary: async () => {
    const { data } = await api.get('/dashboard/summary');
    return data;
  },

  getCategoryBreakdown: async () => {
    const { data } = await api.get('/dashboard/category-breakdown');
    return data;
  },

  getTrends: async (months: number = 6) => {
    const { data } = await api.get(`/dashboard/trends?months=${months}`);
    return data;
  },

  getRecentActivity: async (limit: number = 10) => {
    const { data } = await api.get(`/dashboard/recent?limit=${limit}`);
    return data;
  },

  getMySummary: async () => {
    const { data } = await api.get('/dashboard/my-summary');
    return data;
  }
};
