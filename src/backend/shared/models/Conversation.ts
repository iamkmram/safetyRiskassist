/**
 * Conversation model - represents a chat conversation.
 * Fields follow snake_case naming to match the API contract.
 */
export interface Conversation {
  id: string;
  title: string;
  last_message_at: string; // ISO8601
  unread: number;
}
