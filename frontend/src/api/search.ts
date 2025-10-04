import axios from 'axios';

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

export const search = async (
  q: string,
  indexes: string[],
  page: number
): Promise<SearchResponse> => {
  const res = await axios.get<SearchResponse>('/search', {
    params: { q, indexes: indexes.join(','), page }
  });
  return res.data;
};