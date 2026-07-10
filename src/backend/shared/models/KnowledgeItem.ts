// ------------------------------------------------------------------
// KnowledgeItem model definition
// ------------------------------------------------------------------

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  // Optional department scoping - the knowledge item belongs to a department
  department_id?: string;
  // Permission key required to view this item (e.g., "knowledge.read")
  required_permission?: string;
  // Additional metadata
  created_at: string;
  updated_at: string;
}
