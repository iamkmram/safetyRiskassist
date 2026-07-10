export interface Department {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  departmentId?: number;
  isActive: boolean;
  createdAt: Date;
  roles?: Role[];
}

export interface Conversation {
  id: number;
  userId?: number;
  startedAt: Date;
}

export interface Message {
  id: number;
  conversationId: number;
  sender: string;
  content: string;
  createdAt: Date;
}

export interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Document {
  id: number;
  fileName: string;
  mimeType?: string;
  storagePath: string;
  uploadedBy?: number;
  uploadedAt: Date;
}

export interface AuditLog {
  id: number;
  userId?: number;
  action: string;
  resourceType?: string;
  resourceId?: number;
  timestamp: Date;
  details?: any;
}

export interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}
