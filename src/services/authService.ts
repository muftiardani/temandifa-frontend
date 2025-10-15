import { Config } from "../config";

const API_URL = `${Config.api.baseUrl}/v1/auth`;

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers,
  });
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 422 && data.errors) {
      const errorMessages = data.errors
        .map((err: any) => Object.values(err)[0])
        .join("\n");
      throw new Error(errorMessages);
    }
    throw new Error(data.message || "Terjadi kesalahan pada server.");
  }
  return data;
};

export const authService = {
  register: async (credentials: object) => {
    return fetchAPI("register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  login: async (login: string, password: string) => {
    return fetchAPI("login", {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });
  },

  loginWithGoogle: async (accessToken: string) => {
    return fetchAPI("google/mobile", {
      method: "POST",
      body: JSON.stringify({ accessToken }),
    });
  },

  forgotPassword: async (email: string) => {
    return fetchAPI("forgotpassword", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, password: string) => {
    return fetchAPI(`resetpassword/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  refreshToken: async (refreshToken: string) => {
    return fetchAPI("refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  logout: async (refreshToken: string) => {
    return fetchAPI("logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};
