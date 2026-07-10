import { DatabaseService } from "./DatabaseService";
import { User } from "../models/User";

/**
 * AuthService - encapsulates Azure AD login URL generation,
 * token exchange, and a mock login helper for demo mode.
 */
export class AuthService {
  /**
   * Returns the Azure AD authorization URL.
   * In production the URL would be constructed from env vars.
   */
  static async getLoginUrl(): Promise<{ url: string }> {
    // Mock URL - replace with real endpoint when integrating.
    return { url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=demo-client-id&response_type=code&redirect_uri=http://localhost:3000/auth/callback" };
  }

  /**
   * Exchanges an OAuth authorization code for tokens and a user profile.
   * This prototype returns a static payload.
   */
  static async exchangeCode(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: Omit<User, "permissions">;
  }> {
    // In a real implementation you would POST to the Azure token endpoint.
    // Here we simply simulate success if the code equals "demo-code".
    if (code !== "demo-code") {
      throw new Error("Invalid authorization code");
    }

    const mockUser: User = {
      id: "user-001",
      name: "Sarah Chen",
      email: "sarah.chen@dertour.com",
      department: "Risk Assessment",
      role: "Travel Advisor",
      avatar: "/avatars/sarah.jpg",
      last_login: "2026-07-08T14:30:00Z",
      permissions: ["knowledge:read", "documents:view"],
    };

    return {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        department: mockUser.department,
        role: mockUser.role,
        avatar: mockUser.avatar,
        last_login: mockUser.last_login,
      },
    };
  }

  /**
   * mockLogin - returns the first mock user (Sarah Chen) for demo mode.
   * The frontend stores the result in localStorage.
   */
  static async mockLogin(): Promise<User> {
//     const rows = await DatabaseService.query<User>("SELECT * FROM auth_user WHERE id = ?", [
//       "user-001",
    ]);
    if (rows.length === 0) {
      throw new Error("Mock user not found");
    }
    // permissions column is stored as JSON string
    const user = rows[0];
    user.permissions = JSON.parse((user as any).permissions);
    return user;
  }
}
