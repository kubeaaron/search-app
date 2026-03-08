import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import Keycloak from 'keycloak-js';
import { getAuthConfig } from '../config/auth';

interface AuthContextType {
  isReady: boolean;
  isAuthenticated: boolean;
  keycloak: Keycloak | null;
  logout: () => Promise<void>;
  login: () => Promise<void>;
  token: string | null;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const config = getAuthConfig();

  useEffect(() => {
    if (!config.enabled) {
      console.log('OIDC authentication is disabled');
      setIsReady(true);
      setIsAuthenticated(true);
      return;
    }

    console.log('Initializing Keycloak with config:', {
      url: config.url,
      realm: config.realm,
      clientId: config.clientId,
      baseUrl: config.baseUrl,
    });

    let isMounted = true;
    //let tokenRefreshInterval: NodeJS.Timeout;
    let tokenRefreshInterval: ReturnType<typeof setInterval>;
    

    const initKeycloak = async () => {
      try {
        const kc = new Keycloak({
          url: config.url,
          realm: config.realm,
          clientId: config.clientId,
        });

        console.log('Keycloak instance created, initializing...');

        const authenticated = await kc.init({
          onLoad: 'login-required',
          silentCheckSsoRedirectUri: `${config.baseUrl}/silent-check-sso.html`,
          redirectUri: `${config.baseUrl}/`,
          checkLoginIframe: false,
          pkceMethod: 'S256',
          enableLogging: true,
        });

        if (!isMounted) {
          console.log('Component unmounted during init');
          return;
        }

        console.log('Keycloak init completed:', {
          returnedAuthenticated: authenticated,
          kcAuthenticated: kc.authenticated,
          hasToken: !!kc.token,
          username: kc.tokenParsed?.preferred_username,
          redirectUrls: {
            silentCheckSso: `${config.baseUrl}/silent-check-sso.html`,
            baseUrl: config.baseUrl,
          },
        });

        // Use the actual keycloak authenticated property
        // The return value of init() might not reflect real state after redirects
        const isAuth = kc.authenticated === true;
        
        setKeycloak(kc);
        setIsAuthenticated(isAuth);
        
        if (isAuth && kc.token) {
          setToken(kc.token);
          setUsername(kc.tokenParsed?.preferred_username || null);
          console.log('User authenticated:', kc.tokenParsed?.preferred_username);
        } else if (!isAuth) {
          console.warn('Keycloak init completed but user is not authenticated');
          // This can happen if onLoad: login-required redirects the browser
          // In that case, we should not set isReady yet
        }

        // Set up token refresh to keep session alive
        if (isAuth) {
          const refreshInterval = setInterval(() => {
            if (kc.isTokenExpired?.(5)) {
              console.log('Token expired, refreshing...');

              try {
                (kc as any).refreshToken(5)
                  .then(() => {
                    if (isMounted && kc.token) {
                      setToken(kc.token);
                      console.log('Token refreshed successfully');
                    }
                  })
                  .catch((err: unknown) => {
                    console.error('Token refresh failed:', err);
                  });
              } catch (err) {
                console.error('Error calling refreshToken:', err);
              }
            }
          }, 30000);

          tokenRefreshInterval = refreshInterval;
        }

        setIsReady(true);
        console.log('Keycloak initialization complete');
      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        if (isMounted) {
          setIsReady(true);
        }
      }
    };

    initKeycloak();

    return () => {
      isMounted = false;
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, [config.enabled, config.url, config.realm, config.clientId, config.baseUrl]);

  const logout = useCallback(async () => {
    if (keycloak && config.enabled) {
      try {
        setIsAuthenticated(false);
        setToken(null);
        setUsername(null);
        await keycloak.logout({ redirectUri: config.baseUrl });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }, [keycloak, config.enabled, config.baseUrl]);

  const login = useCallback(async () => {
    if (keycloak && config.enabled) {
      try {
        console.log('Triggering Keycloak login...');
        await keycloak.login();
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  }, [keycloak, config.enabled]);

  const value: AuthContextType = {
    isReady,
    isAuthenticated,
    keycloak,
    logout,
    login,
    token,
    username,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
