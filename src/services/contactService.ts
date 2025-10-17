import { fetchWithAuth } from "./apiService";
import { Config } from "../config";

const API_URL = `${Config.api.baseUrl}/v1/contacts`;

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

export const contactService = {
  getContacts: async () => {
    return handleFetch(API_URL);
  },

  addContact: async (contact: { name: string; phoneNumber: string }) => {
    return handleFetch(API_URL, {
      method: "POST",
      body: JSON.stringify(contact),
    });
  },

  deleteContact: async (id: string) => {
    return handleFetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
  },

  updateContact: async (
    id: string,
    contact: { name: string; phoneNumber: string }
  ) => {
    return handleFetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(contact),
    });
  },
};
