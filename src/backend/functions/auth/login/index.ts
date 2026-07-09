import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { mockAuthenticate } from "../../../shared/services/AuthService";

/**
 * HTTP trigger for /auth/login - in the mock environment this simply forwards
 * to AuthService.mockAuthenticate and returns a JSON payload that matches the
 * /auth/callback contract.
 *
 * Expected query parameters:
 *   provider - identity provider name (e.g., "microsoft")
 *   guest    - optional flag ("true") to indicate guest mode
 */
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const provider = (req.query.provider as string) || "microsoft";
  const isGuest = req.query.guest === "true";

  try {
    const authResult = await mockAuthenticate(provider, isGuest);
    context.res = {
      // 200 OK
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: {
        access_token: authResult.access_token,
        refresh_token: authResult.refresh_token,
        expires_in: authResult.expires_in,
        user: authResult.user
          ? {
              id: authResult.user.id,
              display_name: authResult.user.name,
              email: authResult.user.email,
              department: authResult.user.department,
              role: authResult.user.role,
              photo_url: authResult.user.avatar,
              last_login: authResult.user.lastLogin,
              permissions: authResult.user.permissions
            }
          : null
      }
    };
  } catch (error) {
    context.log.error("Login mock error:", error);
    context.res = {
      status: 500,
      body: { error: "Internal Server Error" }
    };
  }
};

export default httpTrigger;
