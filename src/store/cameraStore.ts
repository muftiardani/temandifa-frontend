import { create } from "zustand";

interface CameraState {
  isProcessing: boolean;
  detections: any[];
  setIsProcessing: (status: boolean) => void;
  setDetections: (detections: any[]) => void;
  clearDetections: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  isProcessing: false,
  detections: [],
  setIsProcessing: (status) => set({ isProcessing: status }),
  setDetections: (detections) => set({ detections }),
  clearDetections: () => set({ detections: [], isProcessing: false }),
}));
