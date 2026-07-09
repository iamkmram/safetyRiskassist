/**
 * Stub SearchService - always returns an empty result set.
 * Intended for UI development before the search backend is ready.
 */

export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  updated_at: string;
}

/**
 * Perform a search across knowledge items.
 * @param query - freeform search string
 * @param category - optional category filter
 * @returns empty array of SearchResult
 */
export async function searchKnowledge(
  query: string,
  category?: string
): Promise<SearchResult[]> {
  // Mock implementation - no data.
  return [];
}
