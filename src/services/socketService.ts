import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { useCallStore } from "../store/callStore";
import { Config } from "../config";

let socket: Socket;

export const socketService = {
  connect: () => {
    const token = useAuthStore.getState().accessToken;
    if (socket || !token) return;

    if (!Config.api.baseUrl) {
      console.error("API base URL is not configured for WebSocket.");
      return;
    }

    const socketUrl = Config.api.baseUrl.replace("/api", "");

    socket = io(socketUrl, {
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket.IO terhubung dengan ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket.IO terputus:", reason);
    });

    socket.on("call-declined", () => {
      console.log("Panggilan ditolak oleh penerima.");
      useCallStore.getState().clearCall();
    });

    socket.on("call-cancelled", () => {
      console.log("Panggilan dibatalkan oleh penelepon.");
      useCallStore.getState().clearCall();
    });

    socket.on("call-ended", () => {
      console.log("Panggilan telah diakhiri dari seberang.");
      useCallStore.getState().clearCall();
    });
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      console.log("Socket.IO terputus.");
    }
  },

  emit: (event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn(
        `Socket.IO tidak terhubung. Event "${event}" tidak terkirim.`
      );
    }
  },
};
