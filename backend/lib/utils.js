// Cache structure: { token: string, expiresAt: number }
let tokenCache = null;

async function fetchLogtoManagementApiAccessToken() {
  // Return cached token if it exists and not expiring within 5 minutes
  if (tokenCache?.expiresAt && Date.now() < tokenCache.expiresAt - 5 * 60 * 1000) {
    return tokenCache.token;
  }

  const response = await fetch(process.env.LOGTO_MANAGEMENT_API_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.LOGTO_MANAGEMENT_API_APPLICATION_ID}:${process.env.LOGTO_MANAGEMENT_API_APPLICATION_SECRET}`).toString(
        'base64'
      )}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      resource: process.env.LOGTO_MANAGEMENT_API_RESOURCE,
      scope: 'all',
    }).toString(),
  });
  const tokenResponse = await response.json();
  // Store new token with expiration time
  tokenCache = {
    token: tokenResponse.access_token,
    expiresAt: Date.now() + (tokenResponse.expires_in * 1000), // Convert seconds to milliseconds
  };
  
  return tokenCache.token;
}

module.exports = {
  fetchLogtoManagementApiAccessToken
};