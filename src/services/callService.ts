import { Config } from "../config";
import { fetchWithAuth } from "./apiService";

const API_URL = `${Config.api.baseUrl}/v1/call`;

export const callService = {
  initiate: async (calleePhoneNumber: string) => {
    const response = await fetchWithAuth(`${API_URL}/initiate`, {
      method: "POST",
      body: JSON.stringify({ calleePhoneNumber }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memulai panggilan.");
    }
    return response.json();
  },

  answer: async (callId: string) => {
    const response = await fetchWithAuth(`${API_URL}/${callId}/answer`, {
      method: "POST",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menjawab panggilan.");
    }
    return response.json();
  },

  end: async (callId: string) => {
    const response = await fetchWithAuth(`${API_URL}/${callId}/end`, {
      method: "POST",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Gagal mengakhiri panggilan.");
    }
    return response.json();
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
