import api from './client';
import type { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  changePassword: async (passwords: any) => {
    const { data } = await api.patch('/auth/change-password', passwords);
    return data;
  },

  updateProfile: async (profile: any) => {
    const { data } = await api.patch('/auth/profile', profile);
    return data;
  }
};
