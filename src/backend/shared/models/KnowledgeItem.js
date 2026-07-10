"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeItem = void 0;
/**
 * Simple wrapper class for KnowledgeItem (aka Document).
 * Provides utility methods for summarising content.
 */
class KnowledgeItem {
    constructor(doc) {
        this.id = doc.id;
        this.title = doc.title;
        this.content = doc.content;
        this.author_id = doc.author_id;
        this.created_at = doc.created_at;
        this.updated_at = doc.updated_at;
        // Assign optional merged fields when present
        this.article_id = doc.article_id;
        this.excerpt = doc.excerpt;
        this.category = doc.category;
        this.is_popular = doc.is_popular;
        this.is_published = doc.is_published;
        this.view_count = doc.view_count;
        this.tags = doc.tags;
        this.createdAt = doc.createdAt;
    }
    /** Return first N characters of content for preview */
    preview(chars = 150) {
        if (this.content.length <= chars)
            return this.content;
        return this.content.substring(0, chars) + '...';
    }
    /** Basic keyword extraction - naive implementation */
    keywords() {
        const words = this.content
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/);
        const stopWords = new Set(['the', 'and', 'of', 'to', 'a', 'in', 'for', 'on', 'with']);
        const freq = {};
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
exports.KnowledgeItem = KnowledgeItem;
