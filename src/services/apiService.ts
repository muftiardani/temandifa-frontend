import { useAuthStore } from "../store/authStore";
import { Config } from "../config";

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let { accessToken, refreshAccessToken } = useAuthStore.getState();

  const originalRequest = async (token: string | null) => {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const newOptions: RequestInit = {
      ...options,
      headers,
    };

    try {
      return await fetch(url, newOptions);
    } catch (error: any) {
      if (error.message === "Network request failed") {
        throw new Error("networkError");
      }
      throw error;
    }
  };

  let response = await originalRequest(accessToken);

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        return originalRequest(token as string);
      });
    }

    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        processQueue(null, newAccessToken);
        return originalRequest(newAccessToken);
      } else {
        const error = new Error("Sesi telah habis. Harap login kembali.");
        processQueue(error, null);
        return Promise.reject(error);
      }
    } catch (error) {
      processQueue(error, null);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};

const postFormDataWithAuth = async (
  url: string,
  uri: string,
  fieldName: string,
  fileType: "image" | "audio"
) => {
  const formData = new FormData();

  const file = {
    uri,
    name: `${fieldName}.${fileType === "image" ? "jpg" : "m4a"}`,
    type: `${fileType}/${fileType === "image" ? "jpeg" : "m4a"}`,
  } as any;
  formData.append(fieldName, file);

  const response = await fetchWithAuth(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "serverError");
  }
  return data;
};

export const apiService = {
  detectObject: (uri: string) =>
    postFormDataWithAuth(Config.api.detectUrl, uri, "image", "image"),
  scanImage: (uri: string) =>
    postFormDataWithAuth(Config.api.scanUrl, uri, "image", "image"),
  transcribeAudio: (uri: string) =>
    postFormDataWithAuth(Config.api.transcribeUrl, uri, "audio", "audio"),

  updatePushToken: async (token: string) => {
    const response = await fetchWithAuth(
      `${Config.api.baseUrl}/v1/users/pushtoken`,
      {
        method: "PUT",
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Gagal memperbarui push token.");
    }

    return response.json();
  },
};
