import { useApi } from './base';
import { useMemo } from 'react';
import { useLogto } from '@logto/react';
import { Document } from '../pages/OrganizationPage/types';

export const useOrganizationApi = () => {
  const { fetchWithToken } = useApi();
  const { getOrganizationToken, getOrganizationTokenClaims } = useLogto();

  return useMemo(() => ({
    getDocuments: async (organizationId: string): Promise<Document[]> => {
      return await fetchWithToken('/documents', {
        method: 'GET',
      }, organizationId);
    },

    createDocument: async (organizationId: string, data: {
      title: string;
      content: string;
    }): Promise<Document> => {
      return await fetchWithToken('/documents', {
        method: 'POST',
        body: JSON.stringify(data),
      }, organizationId);
    },

    getUserOrganizationScopes: async (organizationId: string): Promise<string[]> => {
      const organizationToken = await getOrganizationToken(organizationId);
      if (!organizationToken) {
        throw new Error("User is not a member of the organization");
      }

      const tokenClaims = await getOrganizationTokenClaims(organizationId);
      return tokenClaims?.scope?.split(" ") || [];
    },
  }), [fetchWithToken, getOrganizationToken, getOrganizationTokenClaims]);
}; 