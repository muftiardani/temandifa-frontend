import { create } from "zustand";

interface DetectionResult {
  bbox: [number, number, number, number];
  class: string;
  confidence: number;
}

interface CameraState {
  isProcessing: boolean;
  detections: DetectionResult[];
  setIsProcessing: (status: boolean) => void;
  setDetections: (detections: DetectionResult[]) => void;
  clearDetections: () => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  isProcessing: false,
  detections: [],
  setIsProcessing: (status) => set({ isProcessing: status }),
  setDetections: (detections) => set({ detections }),
  clearDetections: () => set({ detections: [], isProcessing: false }),
}));