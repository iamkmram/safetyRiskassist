 
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
  last_login: string; // ISO8601
  permissions: string[]; // e.g. ["knowledge:read"]
}
