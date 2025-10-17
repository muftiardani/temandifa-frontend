import { Config } from "../config";
import { fetchWithAuth } from "./apiService";

const API_URL = `${Config.api.baseUrl}/v1/call`;

const handleFetch = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetchWithAuth(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "serverError");
    }
    return data;
  } catch (error: any) {
    if (error.message === "Network request failed") {
      throw new Error("networkError");
    }
    throw error;
  }
};

export const callService = {
  initiate: async (calleePhoneNumber: string) => {
    return handleFetch(`${API_URL}/initiate`, {
      method: "POST",
      body: JSON.stringify({ calleePhoneNumber }),
    });
  },

  answer: async (callId: string) => {
    return handleFetch(`${API_URL}/${callId}/answer`, {
      method: "POST",
    });
  },

  end: async (callId: string) => {
    return handleFetch(`${API_URL}/${callId}/end`, {
      method: "POST",
    });
  },

  getStatus: async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/status`);
      if (!response.ok) {
        return null;
      }
      return response.json();
    } catch (error) {
      console.error("Gagal memeriksa status panggilan:", error);
      return null;
    }
  },
};
