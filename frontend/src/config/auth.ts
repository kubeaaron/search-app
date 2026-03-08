/**
 * Keycloak authentication configuration
 * Configuration values are loaded from:
 * 1. window.appConfig (runtime injection in production)
 * 2. environment variables (development)
 */

declare global {
  interface Window {
    appConfig?: {
      oidc: {
        enabled: boolean;
        url: string;
        realm: string;
        clientId: string;
        baseUrl?: string;
      };
    };
  }
}

export interface AuthConfig {
  enabled: boolean;
  url: string;
  realm: string;
  clientId: string;
  baseUrl?: string;
}

export const getAuthConfig = (): AuthConfig => {
  // Try to get config from window.appConfig (runtime injection)
  if (typeof window !== 'undefined' && window.appConfig?.oidc) {
    const { enabled, url, realm, clientId, baseUrl } = window.appConfig.oidc;
    return {
      enabled: typeof enabled === 'string' ? enabled !== 'false' : enabled,
      url,
      realm,
      clientId,
      baseUrl: baseUrl || window.location.origin,
    };
  }

  // Fallback to environment variables (development)
  const enabled = import.meta.env.VITE_OIDC_ENABLED !== 'false';
  
  return {
    enabled,
    url: import.meta.env.VITE_OIDC_URL || 'http://localhost:30085',
    realm: import.meta.env.VITE_OIDC_REALM || 'Demo',
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID || 'search-app',
    baseUrl: import.meta.env.VITE_OIDC_BASE_URL || window.location.origin,
  };
};

