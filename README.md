# SearchApp

A search application with a React frontend and Go backend, secured with Keycloak OIDC authentication.

## Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Go with OpenSearch and MinIO integration
- **Orchestration**: Kubernetes with Helm charts
- **Authentication**: Keycloak OIDC

## Getting Started

### Local Development

1. **Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your Keycloak settings
   npm install
   npm run dev
   ```

2. **Backend**:
   ```bash
   cd go-search-api
   go run cmd/server/main.go
   ```

### Kubernetes Deployment

```bash
helm install search-app ./search-app-helm \
  -n search-app \
  --create-namespace \
  -f search-app-helm/values.yaml
```

## Configuration

### OIDC/Keycloak Authentication

See [OIDC_SETUP.md](./OIDC_SETUP.md) for detailed information on:
- Setting up Keycloak OIDC authentication
- Configuring frontend and backend for authentication
- Kubernetes/Helm deployment with OIDC
- Troubleshooting authentication issues

### Environment Variables

- **Frontend**: See `frontend/.env.example`
- **Backend**: See `go-search-api/` directory
- **Helm**: See `search-app-helm/values*.yaml` files

## Project Structure

```
├── frontend/               # React frontend application
├── go-search-api/         # Go backend API
├── search-app-helm/       # Helm charts for Kubernetes deployment
├── certs/                 # SSL/TLS certificates
└── docker-compose.yml     # Docker Compose for local development
```

## Features

- Full-text search across multiple indices
- Image search and modal viewer
- Multi-category filtering (people, apps, articles, images)
- Pagination support
- Secure authentication with Keycloak/OIDC
- Kubernetes native deployment
- Configurable via Helm values

## Contributing

See individual component READMEs for specific development instructions.

