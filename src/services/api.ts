import Toast from "react-native-toast-message";
import {
  DETECT_API_URL,
  SCAN_API_URL,
  TRANSCRIBE_API_URL,
} from "../config/api";
import { Strings } from "../constants/Strings";

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
      throw new Error(data.error || Strings.general.serverError);
    }
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Permintaan API dibatalkan:", url);
      return;
    }

    console.error(`Error saat memanggil ${url}:`, error);

    let userMessage = Strings.general.genericError;
    if (
      error instanceof TypeError &&
      error.message.includes("Network request failed")
    ) {
      userMessage = Strings.general.networkError;
    }

    Toast.show({
      type: "error",
      text1: Strings.general.failure,
      text2: userMessage,
    });

    throw error;
  }
};

export const apiService = {
  detectObject: (uri: string, signal: AbortSignal) =>
    postFormData(DETECT_API_URL, uri, "image", "image", { signal }),
  scanImage: (uri: string) => postFormData(SCAN_API_URL, uri, "image", "image"),
  transcribeAudio: (uri: string) =>
    postFormData(TRANSCRIBE_API_URL, uri, "audio", "audio"),
};
