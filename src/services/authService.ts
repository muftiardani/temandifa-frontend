import { Config } from "../config";
import { fetchWithAuth } from "./apiService";

const API_URL = `${Config.api.baseUrl}/v1/auth`;

const fetchAPI = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (
        response.status === 422 &&
        data.errors &&
        Array.isArray(data.errors)
      ) {
        const errorMessages = data.errors
          .map((err: any) =>
            typeof err === "object" && err !== null
              ? Object.values(err)[0]
              : "Invalid error format"
          )
          .join("\n");
        throw new Error(errorMessages || "Validation Error");
      }
      throw new Error(data?.message || "serverError");
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "Network request failed") {
      throw new Error("networkError");
    }
    throw error;
  }
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
    try {
      await fetchAPI("logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      return { success: true };
    } catch (error) {
      console.error("Logout API call failed:", error);
      return { success: false, error };
    }
  },

  getSessions: async () => {
    const response = await fetchWithAuth(`${API_URL}/sessions`);
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Gagal mengambil daftar sesi." }));
      throw new Error(errorData.message || "Gagal mengambil daftar sesi.");
    }
    return response.json();
  },

  revokeSession: async (sessionId: string) => {
    const response = await fetchWithAuth(`${API_URL}/sessions/${sessionId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Gagal menghapus sesi." }));
      throw new Error(errorData.message || "Gagal menghapus sesi.");
    }
    return { success: true };
  },
};
