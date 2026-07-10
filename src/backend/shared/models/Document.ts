export interface Document {
  id: string;
  name: string;
  folder_id: string | null;
  url: string;
  created_at: string; // ISO8601
  updated_at: string; // ISO8601
}
