import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { mockAuthenticate } from '../../../shared/services/AuthService';
import { AuthService } from '../../../shared/services/AuthService';
import { DatabaseService } from '../../../../backend/shared/services/DatabaseService';

const db = new DatabaseService();

/**
 * Azure Function HTTP trigger for /auth/login.
 *
 * Supports two flows:
 * 1. OAuth code exchange (`?code=...`) – uses AuthService.exchangeCode.
 * 2. Mock authentication (`?provider=...&guest=...`) – uses mockAuthenticate.
 *
 * Returns JSON responses matching the expected contracts.
 */
export const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const code = req.query?.code as string | undefined;

  // Flow 1: Azure AD code exchange
  if (code) {
    try {
      const tokenResponse = await AuthService.exchangeCode(code);
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: tokenResponse,
      };
    } catch (error: any) {
      context.res = {
        status: 400,
        body: { error: error?.message ?? 'Invalid authorization code' },
      };
    }
    return;
  }

  // Flow 2: Mock authentication
  const provider = (req.query.provider as string) || 'microsoft';
  const isGuest = req.query.guest === 'true';

  try {
    const authResult = await mockAuthenticate(provider, isGuest);
    context.res = {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
              permissions: authResult.user.permissions,
            }
          : null,
      },
    };
  } catch (error) {
    context.log.error('Login mock error:', error);
    context.res = {
      status: 500,
      body: { error: 'Internal Server Error' },
    };
  }
};

export default httpTrigger;

/**
 * AWS Lambda handler for retrieving the Azure AD login URL.
 *
 * Returns JSON containing the URL configured via the AZURE_AD_LOGIN_URL environment variable.
 */
export const handler = async (
  _event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const loginUrl = process.env.AZURE_AD_LOGIN_URL ?? '';
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: loginUrl }),
    };
  } catch (error) {
    console.error('Login URL fetch error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
