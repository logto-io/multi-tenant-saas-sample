import {
  LogtoProvider,
  LogtoConfig,
  useLogto,
  UserScope,
  ReservedResource,
} from "@logto/react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Landing";
import Dashboard from "./Dashboard";
import Callback from "../Callback";
import OrganizationPage from "../OrganizationPage";
import { APP_ENV } from "../../env";

const config: LogtoConfig = {
  endpoint: APP_ENV.logto.endpoint,
  appId: APP_ENV.logto.appId,
  scopes: [UserScope.Organizations, "read:documents", "create:documents", "create:organization"],
  resources: [ReservedResource.Organization, APP_ENV.api.resourceIndicator],
};

function App() {
  return (
    <LogtoProvider config={config}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Routes>
          <Route path="/callback" element={<Callback />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </div>
    </LogtoProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useLogto();

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/:orgId" element={<OrganizationPage />} />
    </Routes>
  );
}

export default App;
