import { create } from "zustand";

type CallState = {
  callId: string | null;
  channelName: string | null;
  token: string | null;
  uid: number | null;
  isActive: boolean;
  isReceivingCall: boolean;
  callerName: string | null;

  setOutgoingCall: (details: {
    callId: string;
    channelName: string;
    token: string;
    uid: number;
  }) => void;
  setIncomingCall: (details: {
    callId: string;
    channelName: string;
    callerName: string;
  }) => void;
  setCallCredentials: (details: {
    channelName: string;
    token: string;
    uid: number;
  }) => void;
  clearCall: () => void;
};

export const useCallStore = create<CallState>((set) => ({
  callId: null,
  channelName: null,
  token: null,
  uid: null,
  isActive: false,
  isReceivingCall: false,
  callerName: null,

  setOutgoingCall: ({ callId, channelName, token, uid }) =>
    set({
      callId,
      channelName,
      token,
      uid,
      isActive: true,
      isReceivingCall: false,
    }),

  setIncomingCall: ({ callId, channelName, callerName }) =>
    set({
      callId,
      channelName,
      callerName,
      isReceivingCall: true,
      isActive: false,
    }),

  setCallCredentials: ({ channelName, token, uid }) =>
    set({
      channelName,
      token,
      uid,
      isActive: true,
      isReceivingCall: false,
    }),

  clearCall: () =>
    set({
      callId: null,
      channelName: null,
      token: null,
      uid: null,
      isActive: false,
      isReceivingCall: false,
      callerName: null,
    }),
}));
