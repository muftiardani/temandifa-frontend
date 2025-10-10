import { create } from "zustand";
import { contactService } from "../services/contactService";

export interface EmergencyContact {
  _id: string;
  name: string;
  phoneNumber: string;
}

interface ContactState {
  contacts: EmergencyContact[];
  fetchContacts: () => Promise<void>;
  addContact: (contact: { name: string; phoneNumber: string }) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactState>((set) => ({
  contacts: [],
  fetchContacts: async () => {
    try {
      const contacts = await contactService.getContacts();
      set({ contacts });
    } catch (error) {
      console.error("Gagal mengambil kontak:", error);
    }
  },
  addContact: async (contact) => {
    try {
      const newContact = await contactService.addContact(contact);
      set((state) => ({
        contacts: [...state.contacts, newContact],
      }));
    } catch (error) {
      console.error("Gagal menambahkan kontak:", error);
      throw error;
    }
  },
  removeContact: async (id) => {
    try {
      await contactService.deleteContact(id);
      set((state) => ({
        contacts: state.contacts.filter((c) => c._id !== id),
      }));
    } catch (error) {
      console.error("Gagal menghapus kontak:", error);
      throw error;
    }
  },
}));
