import { useLogto } from "@logto/react";
import { useMemo } from "react";
import { APP_ENV } from "../env";

const API_BASE_URL = APP_ENV.api.baseUrl;
const DOCUMIND_API_RESOURCE_INDICATOR = APP_ENV.api.resourceIndicator;

export type ApiError = {
  message: string;
  status?: number;
};

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export const useApi = () => {
  const { getAccessToken, getOrganizationToken } = useLogto();

  const fetchWithToken = useMemo(() => async (
    endpoint: string,
    options: RequestInit = {},
    organizationId?: string
  ) => {
    try {
      let token: string | undefined;
      
      if (organizationId) {
        token = await getOrganizationToken(organizationId);
      } else {
        token = await getAccessToken(DOCUMIND_API_RESOURCE_INDICATOR);
      }

      if (!token) {
        throw new ApiRequestError(
          organizationId
            ? "User is not a member of the organization"
            : "Failed to get access token"
        );
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new ApiRequestError(
          `API request failed: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        throw error;
      }
      throw new ApiRequestError(error instanceof Error ? error.message : String(error));
    }
  }, [getAccessToken, getOrganizationToken]);

  return { fetchWithToken };
}; 