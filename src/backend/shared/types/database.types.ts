
// -------------------------------------------------------------------
// Type representing the raw DB shape of a help article
// -------------------------------------------------------------------
export type HelpArticleDB = {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_popular: boolean;
  is_recent: boolean;
};
