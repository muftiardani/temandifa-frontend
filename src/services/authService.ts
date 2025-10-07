import { Config } from '../config';
import { useAuthStore } from '../store/authStore';

const API_URL = `${Config.api.baseUrl}/v1/auth`;

const getToken = () => useAuthStore.getState().authToken;

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/${endpoint}`, { ...options, headers });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }
  return data;
};

export const authService = {
  register: async (credentials: object) => {
    return fetchAPI('register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  login: async (login: string, password: string) => {
    return fetchAPI('login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });
  },

  forgotPassword: async (email: string) => {
    return fetchAPI('forgotpassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  loginWithGoogle: async (accessToken: string) => {
    return fetchAPI('google/mobile', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  }
};