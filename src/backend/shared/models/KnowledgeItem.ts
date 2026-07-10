// @ts-nocheck
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
  createdAt?: string | Date;
  /** Optional department scoping */
  department_id?: string;
  /** Permission key required to view this item */
  required_permission?: string;
  /** Vector embedding data */
  vectorEmbedding?: number[];
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
  createdAt?: string | Date;
  department_id?: string;
  required_permission?: string;
  vectorEmbedding?: number[];

  constructor(doc: Document) {
    this.id = (doc as any).id;
    this.title = (doc as any).title;
    this.content = (doc as any).content;
    this.author_id = (doc as any).author_id;
    this.created_at = (doc as any).created_at;
    this.updated_at = (doc as any).updated_at;

    this.article_id = (doc as any).article_id;
    this.excerpt = (doc as any).excerpt;
    this.category = (doc as any).category;
    this.is_popular = (doc as any).is_popular;
    this.is_published = (doc as any).is_published;
    this.view_count = (doc as any).view_count;
    this.tags = (doc as any).tags;
    this.createdAt = (doc as any).createdAt;
    this.department_id = (doc as any).department_id;
    this.required_permission = (doc as any).required_permission;
    this.vectorEmbedding = (doc as any).vectorEmbedding;
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
    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }
}

/**
 * Additional metadata interface augmentations (preserved for compatibility)
 */
export interface KnowledgeItem {
  // Duplicate declarations merged by TypeScript.
}
