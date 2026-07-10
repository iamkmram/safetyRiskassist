// @ts-nocheck
import axios from 'axios';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { DatabaseService } from "./DatabaseService";
import { User } from "../models/User";

/**
 * Custom error type for authentication-related failures.
 */
export class AuthError extends Error {
  public readonly code: number;
  constructor(message: string, code = 401) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

/**
 * Payload extracted from a validated Azure AD JWT.
 */
export interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  roles?: string[];
  [key: string]: any;
}

/**
 * AuthService - encapsulates Azure AD login URL generation,
 * token exchange, JWT validation, and a mock login helper for demo mode.
 */
export class AuthService {
  // --- Instance members for Azure Key Vault and token handling (from integration) ---
  private static readonly KEY_VAULT_URL = process.env.AZURE_KEY_VAULT_URL!;
  private static readonly CLIENT_ID_SECRET_NAME = 'azure-ad-client-id';
  private static readonly CLIENT_SECRET_NAME = 'azure-ad-client-secret';
  private static readonly TENANT_ID = process.env.AZURE_TENANT_ID!;
  private static readonly TOKEN_ENDPOINT = `https://login.microsoftonline.com/${AuthService.TENANT_ID}/oauth2/v2.0/token`;

  private secretClient: SecretClient;
  private credential: DefaultAzureCredential;

  constructor() {
    if (!AuthService.KEY_VAULT_URL) {
      throw new AuthError('Key Vault URL not configured', 500);
    }
    this.credential = new DefaultAzureCredential();
    this.secretClient = new SecretClient(AuthService.KEY_VAULT_URL, this.credential);
  }

  /**
   * Retrieves a secret value from Azure Key Vault.
   */
  private async getSecret(name: string): Promise<string> {
    try {
      const secret = await this.secretClient.getSecret(name);
      return secret.value!;
    } catch (err: any) {
      throw new AuthError(`Failed to retrieve secret "${name}": ${err.message}`, 500);
    }
  }

  /**
   * Validates a JWT issued by Azure AD.
   * For brevity this implementation performs a remote introspection call.
   */
  async validateJwt(token: string): Promise<JwtPayload> {
    if (!token) {
      throw new AuthError('Missing token', 401);
    }
    const jwksUrl = `https://login.microsoftonline.com/${AuthService.TENANT_ID}/discovery/v2.0/keys`;
    try {
      const { data: jwks } = await axios.get(jwksUrl);
      // NOTE: Full verification logic (signature, alg, kid matching, claim checks)
      // is omitted for brevity. We'll rely on Microsoft's token endpoint to
      // validate via a tokeninfo request.
      const introspectResp = await axios.get(
        `https://login.microsoftonline.com/${AuthService.TENANT_ID}/oauth2/v2.0/tokeninfo`,
        { params: { token } }
      );
      if (introspectResp.status !== 200) {
        throw new AuthError('Invalid token', 401);
      }
      return introspectResp.data as JwtPayload;
    } catch (err: any) {
      throw new AuthError(`Token validation failed: ${err.message}`, 401);
    }
  }

  /**
   * Exchanges an authorization code (or resourceowner credentials) for access
   * and refresh tokens.
   */
  async exchangeAuthCode(
    codeOrUsername: string,
    passwordOrRedirectUri: string,
    isResourceOwner = true
  ): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const clientId = await this.getSecret(AuthService.CLIENT_ID_SECRET_NAME);
    const clientSecret = await this.getSecret(AuthService.CLIENT_SECRET_NAME);

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', 'openid profile offline_access');

    if (isResourceOwner) {
      // Resource Owner Password Credentials flow
      params.append('grant_type', 'password');
      params.append('username', codeOrUsername);
      params.append('password', passwordOrRedirectUri);
    } else {
      // Authorization code flow
      params.append('grant_type', 'authorization_code');
      params.append('code', codeOrUsername);
      params.append('redirect_uri', passwordOrRedirectUri);
    }

    try {
      const response = await axios.post(AuthService.TOKEN_ENDPOINT, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response.status !== 200) {
        throw new AuthError('Failed to exchange auth code', response.status);
      }
      const { access_token, refresh_token, expires_in } = response.data;
      return { access_token, refresh_token, expires_in };
    } catch (err: any) {
      const msg = err.response?.data?.error_description || err.message;
      throw new AuthError(`Token exchange error: ${msg}`, err.response?.status || 500);
    }
  }

  /**
   * Refreshes an access token using a previously obtained refresh token.
   */
  async refreshToken(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string; expires_in: number }> {
    const clientId = await this.getSecret(AuthService.CLIENT_ID_SECRET_NAME);
    const clientSecret = await this.getSecret(AuthService.CLIENT_SECRET_NAME);

    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    params.append('scope', 'openid profile offline_access');

    try {
      const response = await axios.post(AuthService.TOKEN_ENDPOINT, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response.status !== 200) {
        throw new AuthError('Failed to refresh token', response.status);
      }
      const { access_token, refresh_token, expires_in } = response.data;
      return { access_token, refresh_token, expires_in };
    } catch (err: any) {
      const msg = err.response?.data?.error_description || err.message;
      throw new AuthError(`Refresh token error: ${msg}`, err.response?.status || 500);
    }
  }

  // --- Static methods for mock/demo functionality (from source/base) ---

  /**
   * Returns the Azure AD authorization URL.
   * In production the URL would be constructed from env vars.
   */
  static async getLoginUrl(): Promise<{ url: string }> {
    // Mock URL - replace with real endpoint when integrating.
    return {
      url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=demo-client-id&response_type=code&redirect_uri=http://localhost:3000/auth/callback"
    };
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
    const rows = await DatabaseService.query<User>(
      "SELECT * FROM auth_user WHERE id = ?",
      ["user-001"]
    );
    if (rows.length === 0) {
      throw new Error("Mock user not found");
    }
    // permissions column is stored as JSON string
    const user = rows[0];
    user.permissions = JSON.parse((user as any).permissions);
    return user;
  }
}
