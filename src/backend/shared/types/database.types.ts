export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  department: string;
  created_at: Date;
}

export interface KnowledgeItemRow {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: Date;
}

export interface ConversationRow {
  id: string;
  title: string;
  created_at: Date;
}

export interface DocumentRow {
  id: string;
  title: string;
  file_key: string;   // storage key (e.g., S3)
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  uploaded_at: Date;
}

export interface PermissionRow {
  id: string;
  document_id: string;
  user_id: string;
  role: string; // e.g., "viewer", "editor"
}
