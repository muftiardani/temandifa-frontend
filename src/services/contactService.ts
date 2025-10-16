import { fetchWithAuth } from "./apiService";
import { Config } from "../config";

const API_URL = `${Config.api.baseUrl}/v1/contacts`;

export const contactService = {
  getContacts: async () => {
    const response = await fetchWithAuth(API_URL);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Gagal mengambil daftar kontak.");
    }
    return response.json();
  },

  addContact: async (contact: { name: string; phoneNumber: string }) => {
    const response = await fetchWithAuth(API_URL, {
      method: "POST",
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Gagal menambahkan kontak baru.");
    }
    return response.json();
  },

  deleteContact: async (id: string) => {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Gagal menghapus kontak.");
    }
    return response.json();
  },

  updateContact: async (
    id: string,
    contact: { name: string; phoneNumber: string }
  ) => {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Gagal memperbarui kontak.");
    }
    return response.json();
  },
};
