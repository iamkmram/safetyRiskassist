import jwt from 'jsonwebtoken';

// ------------------------------------------------------------------
// AuthService - minimal JWT verification helper
// ------------------------------------------------------------------

export interface UserPayload {
  sub: string;          // user identifier (GUID)
  name?: string;
  email?: string;
  roles?: string[];      // optional list of role IDs
  // any other claims you need
}

/**
 * Verifies a JWT signed with the application's secret.
 * In production you would verify against Azure AD public keys.
 */
export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

  /** Verify the JWT and return the decoded payload. */
  static async verifyJwt(token: string): Promise<UserPayload> {
    return new Promise<UserPayload>((resolve, reject) => {
      jwt.verify(token, AuthService.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded as UserPayload);
        }
      });
    });
  }
}
