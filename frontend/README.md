# Multi-tenant SaaS Sample - Frontend Application

This is the frontend application code that accompanies the article on the [multi-tenant SaaS demo](https://blog.logto.io/build-multi-tenant-saas-application).

## Quick Start

This is a demo project with pre-configured settings. To run it locally:

1. Configure the environment variables in `src/env.ts`:
```typescript
export const APP_ENV = {
  logto: {
    endpoint: "<YOUR_LOGTO_ENDPOINT>",
    appId: "<YOUR_LOGTO_APP_ID>",
  },
  api: {
    baseUrl: "<YOUR_BACKEND_API_BASE_URL>",
    resourceIndicator: "<YOUR_API_RESOURCE_INDICATOR>",
  },
  app: {
    redirectUri: "<YOUR_REDIRECT_URI>", // Ensure this matches the redirect URI in your Logto app settings in the Console
    signOutRedirectUri: "<YOUR_SIGN_OUT_REDIRECT_URI>", // Ensure this matches the sign out redirect URI in your Logto app settings in the Console
  },
};
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be running at http://localhost:5173.
