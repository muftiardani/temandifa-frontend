import { useAuthStore } from "../store/authStore";
import { Config } from "../config";

let isRefreshing = false;
type FailedQueuePromise = {
  resolve: (value: string | null) => void;
  reject: (reason?: unknown) => void;
};
let failedQueue: {
  resolve: FailedQueuePromise["resolve"];
  reject: FailedQueuePromise["reject"];
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
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

  const originalRequest = async (token: string | null): Promise<Response> => {
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
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message === "Network request failed"
      ) {
        throw new Error("networkError");
      }
      throw error;
    }
  };

  let response = await originalRequest(accessToken);

  if (response.status === 401) {
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((refreshedToken) => {
        return originalRequest(refreshedToken);
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
): Promise<any> => {
  const formData = new FormData();

  const fileName = `${fieldName}.${fileType === "image" ? "jpg" : "m4a"}`;
  const mimeType = `${fileType}/${fileType === "image" ? "jpeg" : "m4a"}`;

  const file = {
    uri,
    name: fileName,
    type: mimeType,
  } as any;
  formData.append(fieldName, file);

  const response = await fetchWithAuth(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "serverError");
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

  updatePushToken: async (token: string): Promise<any> => {
    const response = await fetchWithAuth(
      `${Config.api.baseUrl}/v1/users/pushtoken`,
      {
        method: "PUT",
        body: JSON.stringify({ token }),
      }
    );

    if (!response.ok) {
      const data = await response
        .json()
        .catch(() => ({ message: "Gagal memperbarui push token." }));
      throw new Error(data?.message || "Gagal memperbarui push token.");
    }

    return response.json();
  },
};
