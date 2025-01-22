const { createRemoteJWKSet, jwtVerify } = require("jose");

const getTokenFromHeader = (headers) => {
  const { authorization } = headers;
  const bearerTokenIdentifier = "Bearer";

  if (!authorization) {
    throw new Error("Authorization header missing");
  }

  if (!authorization.startsWith(bearerTokenIdentifier)) {
    throw new Error("Authorization token type not supported");
  }

  return authorization.slice(bearerTokenIdentifier.length + 1);
};

// The `aud` (audience) claim in the JWT token follows the format:
// "urn:logto:organization:<organization_id>"
// For example: "urn:logto:organization:123456789"
// This format allows us to extract the organization ID from the token
// by removing the "urn:logto:organization:" prefix
const extractOrganizationId = (aud) => {
  if (
    !aud ||
    typeof aud !== "string" ||
    !aud.startsWith("urn:logto:organization:")
  ) {
    throw new Error("Invalid organization token");
  }
  return aud.replace("urn:logto:organization:", "");
};

const decodeJwtPayload = (token) => {
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) {
      throw new Error("Invalid token format");
    }
    const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
    return JSON.parse(payloadJson);
  } catch (error) {
    throw new Error("Failed to decode token payload");
  }
};

const hasRequiredScopes = (tokenScopes, requiredScopes) => {
  if (!requiredScopes || requiredScopes.length === 0) {
    return true;
  }
  const scopeSet = new Set(tokenScopes);
  return requiredScopes.every((scope) => scopeSet.has(scope));
};

const verifyJwt = async (token, audience) => {
  const JWKS = createRemoteJWKSet(new URL(process.env.LOGTO_JWKS_URL));
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: process.env.LOGTO_ISSUER,
    audience,
  });
  return payload;
};

const requireOrganizationAccess = ({ requiredScopes = [] } = {}) => {
  return async (req, res, next) => {
    try {
      // Extract the token
      const token = getTokenFromHeader(req.headers);

      // Dynamically get the audience from the token
      const { aud } = decodeJwtPayload(token);
      if (!aud) {
        throw new Error("Missing audience in token");
      }

      // Verify the token with the audience
      const payload = await verifyJwt(token, aud);

      // Extract organization ID from the audience claim
      const organizationId = extractOrganizationId(payload.aud);

      // Get scopes from the token
      const scopes = payload.scope?.split(" ") || [];

      // Verify required scopes
      if (!hasRequiredScopes(scopes, requiredScopes)) {
        throw new Error("Insufficient permissions");
      }

      // Add organization info to request
      req.user = {
        id: payload.sub,
        organizationId,
      };

      next();
    } catch (error) {
      const errorMessage = error.message === "Insufficient scopes" 
        ? "Unauthorized - Insufficient permissions" 
        : "Unauthorized - Invalid organization access";
      res.status(401).json({ error: errorMessage });
    }
  };
};

const requireAuth = (resource) => {
  if (!resource) {
    throw new Error("Resource parameter is required for authentication");
  }

  return async (req, res, next) => {
    try {
      // Extract the token
      const token = getTokenFromHeader(req.headers);

      // Verify the token
      const payload = await verifyJwt(token, resource);

      // Add user info to request
      req.user = {
        id: payload.sub,
        scopes: payload.scope?.split(" ") || [],
      };

      next();
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  };
};

module.exports = {
  requireAuth,
  requireOrganizationAccess,
};
