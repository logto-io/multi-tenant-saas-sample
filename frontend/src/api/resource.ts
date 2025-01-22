import { useApi } from './base';
import { useMemo } from 'react';

export type Organization = {
  id: string;
  name: string;
  description?: string;
  memberCount?: number;
  role?: string;
};

export type CreateOrganizationData = {
  name: string;
  description?: string;
};

export const useResourceApi = () => {
  const { fetchWithToken } = useApi();

  return useMemo(() => ({
    createOrganization: async (data: CreateOrganizationData): Promise<{ data: { id: string } }> => {
      return await fetchWithToken('/organizations', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  }), [fetchWithToken]);
}; 