export interface Conversation {
  id: string;
  title: string;
  last_message_at: string; // ISO8601
  unread: number;
}
