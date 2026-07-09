export interface KnowledgeItem {
  article_id: string;          // UUID
  title: string;
  content: string;
  category: string;
  created_at: string;          // ISO8601
  updated_at: string;          // ISO8601
  is_popular: boolean;
  is_published: boolean;
  view_count: number;
}
