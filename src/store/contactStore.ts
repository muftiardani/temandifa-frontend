import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
}

interface ContactState {
  contacts: EmergencyContact[];
  addContact: (contact: Omit<EmergencyContact, "id">) => void;
  removeContact: (id: string) => void;
}

export const useContactStore = create(
  persist<ContactState>(
    (set) => ({
      contacts: [],
      addContact: (contact) =>
        set((state) => ({
          contacts: [
            ...state.contacts,
            { id: Date.now().toString(), ...contact },
          ],
        })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((c) => c.id !== id),
        })),
    }),
    {
      name: "emergency-contacts-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
