# OIDC Authentication Setup with Keycloak

This document describes how to configure and use OIDC authentication via Keycloak for the search-app frontend.

## Overview

The frontend application is configured to use Keycloak for OIDC authentication. All users must authenticate before accessing the application.

## Configuration

### Development Environment

For local development, create a `.env` file in the `frontend/` directory:

```bash
VITE_OIDC_ENABLED=true
VITE_OIDC_URL=http://localhost:30085
VITE_OIDC_REALM=Demo
VITE_OIDC_CLIENT_ID=search-app
```

Then run the development server:

```bash
cd frontend
npm install  # or yarn install
npm run dev
```

### Production/Kubernetes Deployment

The OIDC configuration is managed via Helm values files. The configuration is injected into the frontend container at runtime via environment variables.

#### Using the Default Values

```bash
# Deploy with default configuration (localhost:30085)
helm install search-app ./search-app-helm \
  -n search-app \
  --create-namespace
```

#### Customizing OIDC Configuration

Update the Helm values in `values.yaml`, `values-ref.yaml`, or `values-prod.yaml`:

```yaml
frontend:
  config:
    oidc:
      enabled: true                              # Enable/disable OIDC auth
      url: http://keycloak.cluster.local:8080   # Keycloak server URL
      realm: Demo                                # Keycloak realm name
      clientId: search-app                       # OIDC client ID in Keycloak
      baseUrl: https://search-app.local          # Optional: base URL for redirects
```

Then deploy:

```bash
helm install search-app ./search-app-helm \
  -n search-app \
  --create-namespace \
  -f values.yaml
```

#### Using helm upgrade with custom values

```bash
helm upgrade search-app ./search-app-helm \
  -n search-app \
  --set frontend.config.oidc.enabled=true \
  --set frontend.config.oidc.url=http://keycloak.example.com \
  --set frontend.config.oidc.realm=YourRealm \
  --set frontend.config.oidc.clientId=your-client-id
```

## Keycloak Client Configuration

You need to create/configure an OIDC client in your Keycloak instance:

1. Log in to Keycloak Admin Console
2. Navigate to your Realm (default: "Demo")
3. Go to **Clients** and create a new client or edit existing one:
   - **Client ID**: `search-app` (or whatever you set in `VITE_OIDC_CLIENT_ID`)
   - **Client Protocol**: openid-connect
   - **Access Type**: public
   - **Valid OAuth2 Redirect URIs**: 
     - `http://localhost:5173/*` (for development)
     - `https://search-app.local/*` (for production)
     - Any other URLs where your frontend is accessible

4. In the **Advanced Settings** tab:
   - Enable **Server Offline Redirect Token URL** to handle redirects properly

## Disabling OIDC Authentication

To disable OIDC authentication and run without authentication:

### Development

```bash
VITE_OIDC_ENABLED=false npm run dev
```

### Kubernetes/Helm

```bash
helm install search-app ./search-app-helm \
  -n search-app \
  --create-namespace \
  --set frontend.config.oidc.enabled=false
```

When disabled, the app will load normally without requiring login.

## Troubleshooting

### CORS Errors

If you see CORS errors when trying to authenticate:
1. Check that the Keycloak server is accessible from the browser
2. Verify the Keycloak URL is correct
3. Ensure the Keycloak client is configured with correct redirect URIs

### Infinite Loop: "Authenticating..." / "Redirecting to login..."

If you see an infinite loop with the "Authenticating..." message:

**1. Check Keycloak Connectivity**
- Open browser DevTools (F12) → Console tab
- You should see logs starting with "Initializing Keycloak with config:"
- Check that the Keycloak URL is correct in the config
- Try accessing `http://localhost:30085` directly in your browser to verify it's running

**2. Review the Console Logs**
Look for these messages in the browser console:
```
Initializing Keycloak with config: {...}
Keycloak instance created, initializing...
Keycloak init completed: {...}
User authenticated: <username>  // or warning if not authenticated
```

You should see "User authenticated: <username>" after successful login. If you see "Keycloak init completed but user is not authenticated", then the authentication didn't succeed.

**3. Check Keycloak Client Configuration**
- Log in to Keycloak Admin Console at `http://localhost:30085/admin`
- Navigate to your realm (Demo) → Clients → search-app
- Verify:
  - **Access Type**: Must be "public" (not confidential)
  - **Valid OAuth2 Redirect URIs**: Must include `http://localhost:5173/*`
  - **Login Theme**: Check if "login" is configured
  - **Enable Direct Access** Grants: May need to be enabled for testing

**4. Check Network Tab for Errors**
- Open DevTools → Network tab
- Refresh the page and log in
- Look for requests to `http://localhost:30085`
- Check for 40x or 50x errors
- If you see CORS errors, that's a problem with the Keycloak server configuration

**5. Verify Silent Check SSO**
- In DevTools → Network tab
- Look for a request to `silent-check-sso.html`
- It should return 200 OK with the HTML content
- If it's failing, the PKCE flow might not work correctly

**6. Common Configuration Issues**

**Problem**: "Keycloak init completed but user is not authenticated"
- **Solution 1**: Verify the Keycloak OIDC client is configured with the correct redirect URI
- **Solution 2**: Clear browser localStorage and cookies, then try again
- **Solution 3**: Check if the Keycloak server has SSL/TLS issues (try HTTP if available)

**Problem**: Gets stuck after typing credentials
- **Check**: Keycloak might be returning an error - look in the Keycloak server logs
- **Check**: Verify the user exists in Keycloak and has correct permissions
- **Check**: Browser console for any JavaScript errors

**Problem**: Redirect URI mismatch error from Keycloak
- **Solution**: Update the client redirect URI in Keycloak to exactly match:
  - For local dev: `http://localhost:5173/*`
  - For production: `https://search-app.local/*` or your actual domain

### Testing Without Keycloak

If you don't have Keycloak running and want to test the app locally:

```bash
VITE_OIDC_ENABLED=false npm run dev
```

The app will load without requiring authentication.

### Debug Mode

To get even more detailed logging, you can modify `AuthContext.tsx` temporarily:
- The `enableLogging: true` option is already set in the Keycloak init
- Check browser console for all Keycloak debug messages
- Look for the format `[Keycloak] <message>`

### Still Having Issues?

Try this diagnostic sequence:

```bash
# 1. Check Keycloak is running
curl -I http://localhost:30085

# 2. Check the realm exists
curl http://localhost:30085/auth/realms/Demo

# 3. Check the client is configured
curl http://localhost:30085/auth/realms/Demo/.well-known/openid-configuration

# 4. Start frontend with debug output
VITE_OIDC_ENABLED=true npm run dev 2>&1 | tee debug.log
```

Then check the browser console during authentication for the detailed logs.

### Silent SSO Not Working

The app uses PKCE flow for silent SSO. If this fails:
1. Verify `silent-check-sso.html` is being served by the dev server (check Network tab)
2. Ensure the file exists at `frontend/public/silent-check-sso.html`
3. Check browser console for any errors when this script loads
4. Try disabling PKCE temporarily in AuthContext.tsx (remove `pkceMethod: 'S256'`) to see if that's the issue

### User Not Authorized

If you can log in but see authorization errors:
1. Verify the user has the correct roles/permissions in Keycloak
2. Check that the client scope mappings are configured correctly
3. Review the token claims in the browser's Application tab → Local Storage/Session Storage



## File Structure

- `frontend/src/context/AuthContext.tsx` - React context for authentication state
- `frontend/src/config/auth.ts` - OIDC configuration loader
- `frontend/docker-entrypoint.sh` - Docker entrypoint that injects config at runtime
- `frontend/public/silent-check-sso.html` - SSO silent check script
- `frontend/Dockerfile` - Updated to support runtime config injection
- `search-app-helm/templates/deployment/frontend.yaml` - Helm deployment with env vars
- `search-app-helm/values.yaml` - Default Helm values with OIDC config

## Frontend Integration

The authentication is fully integrated into the frontend:

1. **AuthProvider** - Wraps the entire app and manages Keycloak initialization
2. **useAuth Hook** - Components can use this hook to access:
   - `isReady`: Whether auth system is initialized
   - `isAuthenticated`: Whether user is logged in
   - `username`: Current user's preferred username
   - `token`: The access token
   - `logout()`: Logout function
   - `login()`: Login function (if manually triggered)

### Using Auth in Components

```tsx
import { useAuth } from './context/AuthContext';

export const MyComponent: React.FC = () => {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {username}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Security Notes

1. The OIDC client should be configured as "public" for browser-based apps
2. The PKCE flow is used to prevent token interception
3. Tokens are stored in browser session memory and cleared on logout
4. All communication should use HTTPS in production

## Next Steps

1. Create a Keycloak OIDC client in your Demo realm (if not already done)
2. Update the Helm values with your actual Keycloak server information
3. Deploy the application with Helm
4. Test the authentication flow

For more information, refer to:
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [keycloak-js Library](https://github.com/keycloak/keycloak-js)
- [OIDC Protocol](https://openid.net/connect/)
