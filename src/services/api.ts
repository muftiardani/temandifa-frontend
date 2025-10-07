import { Config } from "../config";
import { useAuthStore } from "../store/authStore";

const getToken = () => useAuthStore.getState().authToken;

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

type FileType = "image" | "audio";

const postFormData = async (
  url: string,
  uri: string,
  fieldName: string,
  fileType: FileType,
  options?: { signal?: AbortSignal }
) => {
  try {
    const token = getToken();
    const formData = new FormData();
    const file = {
      uri,
      name: `${fieldName}.${fileType === "image" ? "jpg" : "m4a"}`,
      type: `${fileType}/${fileType === "image" ? "jpeg" : "m4a"}`,
    } as any;

    formData.append(fieldName, file);

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers,
      signal: options?.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Terjadi kesalahan pada server.");
    }
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Permintaan API dibatalkan:", url);
      return;
    }

    if (
      error instanceof TypeError &&
      error.message === "Network request failed"
    ) {
      throw new NetworkError(
        "Gagal terhubung ke server. Periksa koneksi internet Anda."
      );
    }

    console.error(`Error saat memanggil ${url}:`, error);
    throw error;
  }
};

export const apiService = {
  detectObject: (uri: string, signal: AbortSignal) =>
    postFormData(Config.api.detectUrl, uri, "image", "image", { signal }),
  scanImage: (uri: string) =>
    postFormData(Config.api.scanUrl, uri, "image", "image"),
  transcribeAudio: (uri: string) =>
    postFormData(Config.api.transcribeUrl, uri, "audio", "audio"),
};
