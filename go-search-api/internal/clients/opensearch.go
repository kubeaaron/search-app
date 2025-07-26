package clients

import (
    "bytes"
    "encoding/json"
    "fmt"

    "github.com/opensearch-project/opensearch-go"
)

// NewOpenSearchClient initializes an OpenSearch client
func NewOpenSearchClient(url string) (*opensearch.Client, error) {
    cfg := opensearch.Config{
        Addresses: []string{url},
    }
    client, err := opensearch.NewClient(cfg)
    if err != nil {
        return nil, fmt.Errorf("new opensearch client: %w", err)
    }
    return client, nil
}

// ToJSONReader serializes v to JSON and returns an io.Reader
func ToJSONReader(v interface{}) *bytes.Reader {
    b, _ := json.Marshal(v)
    return bytes.NewReader(b)
}
