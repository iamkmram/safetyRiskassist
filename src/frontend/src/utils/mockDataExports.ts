import { AuthUser } from "../types/auth.types";

export const MOCK_USERS: AuthUser[] = [
  {
    id: "user-001",
    name: "Sarah Chen",
    email: "sarah.chen@dertour.com",
    department: "Risk Assessment",
    role: "Travel Advisor",
    avatar: "/avatars/sarah.jpg",
    lastLogin: "2026-07-08T14:30:00Z",
    permissions: ["knowledge:read", "documents:view"],
  },
  {
    id: "user-002",
    name: "Marcus Weber",
    email: "marcus.weber@dertour.com",
    department: "Operations",
    role: "Senior Manager",
    avatar: "/avatars/marcus.jpg",
    lastLogin: "2026-07-07T10:20:00Z",
    permissions: [],
  },
  {
    id: "user-003",
    name: "Emma Schneider",
    email: "emma.schneider@dertour.com",
    department: "Customer Service",
    role: "Travel Specialist",
    avatar: "/avatars/emma.jpg",
    lastLogin: "2026-07-06T08:15:00Z",
    permissions: [],
  },
];

export const mockAuthenticate = async (username: string, password: string) => {
  return { success: true, token: 'dummy-token' };
};

export const mockUsers = [];
