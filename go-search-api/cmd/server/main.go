package main

import (
    "net/http"
    "os"
    "strings"
    "time"

    gorillahandlers "github.com/gorilla/handlers"
    "github.com/gorilla/mux"
    log "github.com/sirupsen/logrus"

    "go-search-api/internal/config"
    "go-search-api/internal/clients"
    apphandlers "go-search-api/internal/handlers"
)

func main() {
    // Configure structured logging
    log.SetFormatter(&log.JSONFormatter{})
    log.SetOutput(os.Stdout)
    log.SetLevel(log.InfoLevel)

    // Load configuration
    cfg, err := config.Load()
    if err != nil {
        log.Fatalf("config load error: %v", err)
    }

    // Initialize OpenSearch and MinIO clients
    osClient, err := clients.NewOpenSearchClient(cfg.OpenSearchURL)
    if err != nil {
        log.Fatalf("opensearch client error: %v", err)
    }

    // Sanitize MinIO endpoint (remove scheme and path)
    minioEndpoint := strings.TrimPrefix(cfg.MinioEndpoint, "http://")
    minioEndpoint = strings.TrimPrefix(minioEndpoint, "https://")
    minioEndpoint = strings.Split(minioEndpoint, "/")[0]

    minioClient, err := clients.NewMinioClient(
        minioEndpoint, cfg.MinioAccessKey, cfg.MinioSecretKey,
    )
    if err != nil {
        log.Fatalf("minio client error: %v", err)
    }

    // Create router and register handlers
    r := mux.NewRouter()
    r.HandleFunc("/search", apphandlers.SearchHandler(osClient, minioClient, cfg)).Methods("GET")

    // Add logging middleware
    loggedRouter := gorillahandlers.LoggingHandler(os.Stdout, r)

    srv := &http.Server{
        Handler:      loggedRouter,
        Addr:         cfg.ListenAddr,
        WriteTimeout: 15 * time.Second,
        ReadTimeout:  15 * time.Second,
        IdleTimeout:  60 * time.Second,
    }

    log.Infof("Server listening on %s", cfg.ListenAddr)
    if err := srv.ListenAndServe(); err != nil {
        log.Fatalf("server error: %v", err)
    }
}

