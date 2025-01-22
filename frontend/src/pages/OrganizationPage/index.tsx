import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useLogto } from "@logto/react";
import { useOrganizationApi } from "../../api/organization";
import Topbar from "../../components/Topbar";
import { type Document } from './types';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ActionBar } from './components/ActionBar';
import { DocumentList } from './components/DocumentList';

const OrganizationPage = () => {
  const { orgId: organizationId } = useParams();
  const { isAuthenticated } = useLogto();
  const { getDocuments, getUserOrganizationScopes } = useOrganizationApi();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userScopes, setUserScopes] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    if (!organizationId || !isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const [scopes, docsData] = await Promise.all([
        getUserOrganizationScopes(organizationId),
        getDocuments(organizationId),
      ]);

      setUserScopes(scopes);
      setDocuments(docsData);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  }, [organizationId, isAuthenticated, getUserOrganizationScopes, getDocuments]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar organizationId={organizationId} showBackButton />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ActionBar canCreateDocuments={userScopes.includes("create:documents")} />
          <DocumentList documents={documents} />
        </div>
      </div>
    </div>
  );
};

export default OrganizationPage;
