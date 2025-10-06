import { Config } from "../config";

const API_URL = `${Config.api.baseUrl}/v1/call`;

export const callService = {
  initiate: async (calleePhoneNumber: string) => {
    const response = await fetch(`${API_URL}/initiate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ callId }),
    }).then((res) => res.json());
  },
};
