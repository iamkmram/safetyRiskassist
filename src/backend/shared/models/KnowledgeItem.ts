import { Document } from '../types/database.types';

/**
 * Simple wrapper class for KnowledgeItem (aka Document).
 * Provides utility methods for summarising content.
 */
export class KnowledgeItem implements Document {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;

  constructor(doc: Document) {
    this.id = doc.id;
    this.title = doc.title;
    this.content = doc.content;
    this.author_id = doc.author_id;
    this.created_at = doc.created_at;
    this.updated_at = doc.updated_at;
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
      .replace(/[^a-z0-9\\s]/g, '')
      .split(/\\s+/);
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
