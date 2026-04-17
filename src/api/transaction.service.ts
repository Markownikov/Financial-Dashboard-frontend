import api from './client';

export const transactionService = {
  getAll: async (params: any = {}) => {
    const { data } = await api.get('/transactions', { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/transactions/${id}`);
    return data;
  },

  create: async (transactionData: any, idempotencyKey: string) => {
    const { data } = await api.post('/transactions', transactionData, {
      headers: { 'Idempotency-Key': idempotencyKey }
    });
    return data;
  },

  update: async (id: string, transactionData: any, idempotencyKey: string) => {
    const { data } = await api.put(`/transactions/${id}`, transactionData, {
      headers: { 'Idempotency-Key': idempotencyKey }
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/transactions/${id}`);
    return data;
  },

  restore: async (id: string) => {
    const { data } = await api.patch(`/transactions/${id}/restore`);
    return data;
  }
};
