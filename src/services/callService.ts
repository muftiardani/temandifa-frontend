import { Config } from "../config";
import { useAuthStore } from "../store/authStore";

const API_URL = `${Config.api.baseUrl}/v1/call`;
const getToken = () => useAuthStore.getState().authToken;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const callService = {
  initiate: async (calleePhoneNumber: string) => {
    const response = await fetch(`${API_URL}/initiate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ calleePhoneNumber }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memulai panggilan.");
    }
    return response.json();
  },

  answer: async (callId: string) => {
    const response = await fetch(`${API_URL}/answer`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ callId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menjawab panggilan.");
    }
    return response.json();
  },

  end: async (callId: string) => {
    return fetch(`${API_URL}/end`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ callId }),
    }).then((res) => res.json());
  },
};
