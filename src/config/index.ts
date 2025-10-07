export const Config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    detectUrl: `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/detect`,
    scanUrl: `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/scan`,
    transcribeUrl: `${process.env.EXPO_PUBLIC_API_BASE_URL}/v1/transcribe`,
  },
  sentry: {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  },
  agora: {
    appId: process.env.EXPO_PUBLIC_AGORA_APP_ID,
  },
};
