export const Config = {
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    detectUrl: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/detect`,
    scanUrl: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/scan`,
    transcribeUrl: `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/transcribe`,
  },
  agora: {
    appId: process.env.EXPO_PUBLIC_AGORA_APP_ID,
    channelName: process.env.EXPO_PUBLIC_AGORA_CHANNEL_NAME,
  },
  sentry: {
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  },
};