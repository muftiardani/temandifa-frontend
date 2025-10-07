import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { socketService } from "../services/socketService";

interface AuthState {
  authToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authToken: null,
  isAuthenticated: false,
  isLoading: true,
  setAuthToken: async (token) => {
    await SecureStore.setItemAsync("authToken", token);
    set({ authToken: token, isAuthenticated: true });
    socketService.connect();
  },
  logout: async () => {
    await SecureStore.deleteItemAsync("authToken");
    socketService.disconnect();
    set({ authToken: null, isAuthenticated: false });
  },
  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        set({ authToken: token, isAuthenticated: true });
        socketService.connect();
      }
    } catch (e) {
      console.error("Failed to load auth token.", e);
    } finally {
      set({ isLoading: false });
    }
  },
}));
