export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface LoginCredentials {
  email: string;
  password?: string; // Optional if using OAuth, but required for this app
}

export interface RegisterCredentials {
  email: string;
  password?: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    user: User;
  };
}
