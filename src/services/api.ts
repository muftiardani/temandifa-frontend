import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import { Config } from "../config";
import { useLocalization } from "../hooks/useLocalization";

type FileType = "image" | "audio";

const postFormData = async (
  url: string,
  uri: string,
  fieldName: string,
  fileType: FileType,
  options?: { signal?: AbortSignal }
) => {
  const t = useLocalization();
  const networkState = await NetInfo.fetch();
  if (!networkState.isConnected) {
    Toast.show({
      type: "error",
      text1: t.general.failure,
      text2: t.general.networkError,
    });
    throw new Error(t.general.networkError);
  }

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
      throw new Error(data.error || t.general.serverError);
    }
    return data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Permintaan API dibatalkan:", url);
      return;
    }

    console.error(`Error saat memanggil ${url}:`, error);

    Toast.show({
      type: "error",
      text1: t.general.failure,
      text2: error.message || t.general.genericError,
    });

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
