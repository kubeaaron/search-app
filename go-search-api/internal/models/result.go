package models

// Result represents a single search result hit
type Result struct {
    Index  string                 `json:"index"`
    ID     string                 `json:"id"`
    Score  float64                `json:"score"`
    Fields map[string]interface{} `json:"fields"`
}

// SearchResponse is the full response returned to the frontend
type SearchResponse struct {
    Total   int64             `json:"total"`
    Counts  map[string]int64  `json:"counts"`
    Results []Result          `json:"results"`
}

