export const APP_ENV = {
  logto: {
    endpoint: "<YOUR_LOGTO_ENDPOINT>",
    appId: "<YOUR_LOGTO_APP_ID>",
  },
  api: {
    baseUrl: "http://localhost:3000",
    resourceIndicator: "<YOUR_API_RESOURCE_INDICATOR>",
  },
  app: {
    redirectUri: "http://localhost:5173/callback",
    signOutRedirectUri: "http://localhost:5173/",
  },
} as const; 