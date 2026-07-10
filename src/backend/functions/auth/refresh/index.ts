/* eslint-disable */
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { AuthService, AuthError } from '../../../shared/services/AuthService';

/**
 * Azure Function handler for POST /api/v1/auth/refresh
 * Expected body: { "refresh_token": "string" }
 * Returns: { access_token, refresh_token, expires_in }
 */
export const handler: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      context.res = {
        status: 405,
        body: { error: 'method_not_allowed', detail: 'Only POST allowed', code: 405 },
      };
      return;
    }

    const { refresh_token } = req.body ?? {};

    if (!refresh_token) {
      context.res = {
        status: 400,
        body: { error: 'invalid_request', detail: 'refresh_token required', code: 400 },
      };
      return;
    }

    const authService = new AuthService();
    const tokens = await authService.refreshToken(refresh_token);

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: tokens,
    };
  } catch (err: any) {
    if (err instanceof AuthError) {
      context.res = {
        status: err.code,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'auth_error', detail: err.message, code: err.code },
      };
    } else {
      context.log?.error('Unexpected error in refresh handler', err);
      context.res = {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'server_error', detail: 'Unexpected error', code: 500 },
      };
    }
  }
};
