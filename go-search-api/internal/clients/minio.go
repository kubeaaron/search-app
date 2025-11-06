package clients

import (
    "fmt"
    "time"
    "context"
    "net/url"

    "github.com/minio/minio-go/v7"
    "github.com/minio/minio-go/v7/pkg/credentials"
)

func NewMinioClient(endpoint, accessKey, secretKey string) (*minio.Client, error) {
    client, err := minio.New(endpoint, &minio.Options{
        Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
        Secure: false,
    })
    if err != nil {
        return nil, fmt.Errorf("new minio client: %w", err)
    }
    return client, nil
}

// Generate a presigned GET URL valid for duration
func PresignedURL(client *minio.Client, bucket, object string, duration time.Duration) (string, error) {
    reqParams := make(url.Values)
    url, err := client.PresignedGetObject(context.Background(), bucket, object, duration, reqParams)
    if err != nil {
        return "", err
    }
    return url.String(), nil
}
