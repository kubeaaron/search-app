package config

import (
    "os"
)

type Config struct {
    OpenSearchURL string
    MinioEndpoint string
    MinioAccessKey string
    MinioSecretKey string
    MinioBucket    string
    ListenAddr     string
}

func Load() (*Config, error) {
    return &Config{
        OpenSearchURL: os.Getenv("OPENSEARCH_URL"),
        MinioEndpoint: os.Getenv("MINIO_ENDPOINT"),
        MinioAccessKey: os.Getenv("MINIO_ACCESS_KEY"),
        MinioSecretKey: os.Getenv("MINIO_SECRET_KEY"),
        MinioBucket:    os.Getenv("MINIO_BUCKET"),
        ListenAddr:     os.Getenv("LISTEN_ADDR"),
    }, nil
}