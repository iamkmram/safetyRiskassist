/**
 * Mock authentication service used by frontend and Azure Function stubs.
 * No real Azure AD integration - everything is deterministic.
 */

import { AuthUser, MOCK_USERS } from "../models/User";

/**
 * Returns a dummy login URL - in a real implementation this would be the Azure AD authorize endpoint.
 */
export function getMockLoginUrl(): string {
  return "https://mock-login.dertour.local/authorize";
}

/**
 * Simulates authentication.
 * @param provider - name of the identity provider (e.g. "microsoft")
 * @param isGuest - true when user chooses "Continue as Guest"
 * @returns a promise that resolves with an object containing tokens and user data.
 */
export async function mockAuthenticate(
  provider: string,
  isGuest: boolean
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: AuthUser | null;
}> {
  // Simple deterministic delay to emulate network latency.
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (isGuest) {
    // Guest token - no user payload.
    return {
      access_token: "guest-access-token",
      refresh_token: "guest-refresh-token",
      expires_in: 3600,
      user: null
    };
  }

  // Pick the first mock user for deterministic behaviour.
  const user = MOCK_USERS[0];

  // Basic dummy JWT payload - NOT signed.
  const dummyPayload = Buffer.from(JSON.stringify({ sub: user.id })).toString(
    "base64url"
  );

  return {
    access_token: `mock-token-${dummyPayload}`,
    refresh_token: `mock-refresh-${dummyPayload}`,
    expires_in: 3600,
    user
  };
}
