#!/bin/sh

# Generate config.js from environment variables
cat > /usr/share/nginx/html/config.js << EOF
window.appConfig = {
  oidc: {
    enabled: ${VITE_OIDC_ENABLED:-true},
    url: '${VITE_OIDC_URL:-http://localhost:30085}',
    realm: '${VITE_OIDC_REALM:-Demo}',
    clientId: '${VITE_OIDC_CLIENT_ID:-search-app}',
    baseUrl: '${VITE_OIDC_BASE_URL:-}',
  }
};
EOF

# Start nginx
exec nginx -g "daemon off;"
