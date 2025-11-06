export interface SearchResult {
    index: string;
    id: string;
    score: number;
    fields: Record<string, any>;
  }
  
  export interface SearchResponse {
    total: number;
    counts: Record<string, number>;
    results: SearchResult[];
  }