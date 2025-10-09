import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { socketService } from "../services/socketService";
import { authService } from "../services/authService";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    rememberMe?: boolean
  ) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true,

  setTokens: async (accessToken, refreshToken, rememberMe = false) => {
    if (rememberMe) {
      await SecureStore.setItemAsync("refreshToken", refreshToken);
    } else {
      await SecureStore.deleteItemAsync("refreshToken");
    }
    set({ accessToken, isAuthenticated: true, isGuest: false });
    socketService.connect();
  },

  loginAsGuest: () => {
    set({
      isGuest: true,
      isLoading: false,
      isAuthenticated: false,
      accessToken: null,
    });
  },

  logout: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error("Gagal logout dari server:", error);
    } finally {
      await SecureStore.deleteItemAsync("refreshToken");
      socketService.disconnect();
      set({ accessToken: null, isAuthenticated: false, isGuest: false });
    }
  },

  loadToken: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      if (refreshToken) {
        const newAccessToken = await get().refreshAccessToken();
        if (newAccessToken) {
          socketService.connect();
        } else {
          await get().logout();
        }
      }
    } catch (e) {
      console.error("Gagal memuat refresh token.", e);
    } finally {
      set({ isLoading: false });
    }
  },

  refreshAccessToken: async () => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) {
      set({ isAuthenticated: false, accessToken: null });
      return null;
    }

    try {
      const data = await authService.refreshToken(refreshToken);
      const { accessToken } = data;
      set({ accessToken, isAuthenticated: true });
      return accessToken;
    } catch (error) {
      console.error("Gagal merefresh token:", error);
      await get().logout();
      return null;
    }
  },
}));
