import { Config } from "../config";

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
    const formData = new FormData();
    const file = {
      uri,
      name: `${fieldName}.${fileType === "image" ? "jpg" : "m4a"}`,
      type: `${fileType}/${fileType === "image" ? "jpeg" : "m4a"}`,
    } as any;

    formData.append(fieldName, file);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "multipart/form-data" },
      signal: options?.signal,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "A server error occurred.");
    }
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("API request was canceled:", url);
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

    console.error(`Error calling ${url}:`, error);
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
