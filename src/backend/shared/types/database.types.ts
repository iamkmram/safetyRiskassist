export type KnowledgeItemDB = {
  article_id: string;
  title: string;
  content: string;
  category: string;
  created_at: Date;
  updated_at: Date;
  is_popular: boolean;
  is_published: boolean;
  view_count: number;
};

export type Permission = {
  permission_id: string;
  role: string;
  resource: string;
  can_read: boolean;
  can_write: boolean;
  created_at: Date;
};
