# Multi-tenant SaaS Sample Application

This is the companion code for the blog post [Build a multi-tenant SaaS application: A complete guide from design to implementation](https://blog.logto.io/build-multi-tenant-saas-application).

This demo application showcases how to build a SaaS application with multi-tenant support using [Logto](https://logto.io).

The project consists of a frontend application and a backend service that demonstrate organization management, user authentication, document management, and Logto management API integration features.

## About This Project

This codebase implements the concepts and features discussed in the blog post, including:
- Multi-tenant organization management
- User authentication with Logto
- Document management system
- Organization level role-based access control
- Logto management API integration

## Project Structure

- `frontend/`: React-based frontend application
- `backend/`: Node.js backend service

## Quick Start

To run the complete application locally, you'll need to:

1. Start the backend service first
2. Start the frontend application
3. Configure the proper environment variables in both projects
4. Ensure your Logto application is properly configured with the correct redirect URIs

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy the environment file and configure Logto settings:
```bash
cp .env.example .env
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The backend server will be running at http://localhost:3000.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Configure the environment variables in `src/env.ts`:
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

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will be running at http://localhost:5173.

## Learn More

For a detailed explanation of the concepts and implementation details, please read the accompanying blog post:
[Build a multi-tenant SaaS application: A complete guide from design to implementation](https://blog.logto.io/build-multi-tenant-saas-application)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

