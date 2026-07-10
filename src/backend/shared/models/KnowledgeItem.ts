import { Document } from '../types/database.types';

/**
 * KnowledgeItem model - combines fields from multiple versions.
 * Includes legacy and new identifiers, content details, and metadata.
 */
export interface KnowledgeItem {
  /** Legacy identifier (used in older code) */
  id: string;
  /** Current article identifier (used in newer authentication flow) */
  article_id?: string;
  /** Title of the knowledge article */
  title: string;
  /** Short excerpt of the article (legacy) */
  excerpt?: string;
  /** Full content of the article */
  content: string;
  /** Category of the article */
  category?: string;
  /** Creation timestamp (ISO8601) */
  created_at: string;
  /** Last updated timestamp (ISO8601) */
  updated_at?: string;
  /** Indicates if the article is popular */
  is_popular?: boolean;
  /** Publication status of the article */
  is_published?: boolean;
  /** Number of times the article has been viewed */
  view_count?: number;
  /** Tags associated with the article */
  tags?: string[];
  /** Alternate camelCase creation timestamp */
  createdAt?: string;
}

/**
 * Simple wrapper class for KnowledgeItem (aka Document).
 * Provides utility methods for summarising content.
 */
export class KnowledgeItem implements Document, KnowledgeItem {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  created_at: string;
  updated_at?: string;

  // Optional fields from the merged interface
  article_id?: string;
  excerpt?: string;
  category?: string;
  is_popular?: boolean;
  is_published?: boolean;
  view_count?: number;
  tags?: string[];
  createdAt?: string;

  constructor(doc: Document) {
    this.id = (doc as any).id;
    this.title = (doc as any).title;
    this.content = (doc as any).content;
    this.author_id = (doc as any).author_id;
    this.created_at = (doc as any).created_at;
    this.updated_at = (doc as any).updated_at;

    // Assign optional merged fields when present
    this.article_id = (doc as any).article_id;
    this.excerpt = (doc as any).excerpt;
    this.category = (doc as any).category;
    this.is_popular = (doc as any).is_popular;
    this.is_published = (doc as any).is_published;
    this.view_count = (doc as any).view_count;
    this.tags = (doc as any).tags;
    this.createdAt = (doc as any).createdAt;
  }

  /** Return first N characters of content for preview */
  preview(chars: number = 150): string {
    if (this.content.length <= chars) return this.content;
    return this.content.substring(0, chars) + '...';
  }

  /** Basic keyword extraction - naive implementation */
  keywords(): string[] {
    const words = this.content
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/);
    const stopWords = new Set(['the', 'and', 'of', 'to', 'a', 'in', 'for', 'on', 'with']);
    const freq: Record<string, number> = {};
    for (const w of words) {
      if (!stopWords.has(w) && w.length > 2) {
        freq[w] = (freq[w] ?? 0) + 1;
      }
    }
    // Return top 5 frequent words
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  vectorEmbedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}
