export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  embeddingVector: number[];
  /** New field used for analytics - the topic/category of the item */
  category: string;
}
