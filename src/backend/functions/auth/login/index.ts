import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../../shared/services/DatabaseService';
import { User } from '../../../shared/types/database.types';
import { logger } from '../../../../utils/logger';
import { mockAuthenticate, AuthService } from '../../../shared/services/AuthService';
import { getSettings } from '../../../config';
import { hashPassword, verifyPassword } from '../../../utils/auth';

/**
 * Azure Function HTTP trigger for /auth/login (mock flow).
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

/**
 * POST /api/auth/login (real credential verification)
 * Expected body: { email: string, password: string }
 * Returns: { token: string, user: { id, name, department } }
 */
export const loginPassword: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  logger.info('Login request received');

  if (!req.body?.email || !req.body?.password) {
    context.res = {
      status: 400,
      body: { message: 'Email and password are required.' },
    };
    return;
  }

  const { email, password } = req.body;

  try {
    const dbService = await DatabaseService.init(process.env.COSMOS_CONNECTION_STRING!);
    const query = `
      SELECT * FROM c WHERE c.email = @mail
    `;
    const users = await dbService.queryItems<User>('users', query, [{ name: '@mail', value: email }]);
    const user = users[0];

    if (!user) {
      context.res = { status: 401, body: { message: 'Invalid credentials.' } };
      return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      context.res = { status: 401, body: { message: 'Invalid credentials.' } };
      return;
    }

    const tokenPayload = { sub: user.id, email: user.email, role: 'user' };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, { expiresIn: '8h' });

    context.res = {
      status: 200,
      body: {
        token,
        user: {
          id: user.id,
          name: user.name,
          department: user.department,
        },
      },
    };
  } catch (err: any) {
    logger.error('Login handler error:', err);
    context.res = { status: 500, body: { message: 'Internal server error.' } };
  }
};

/**
 * Demo login implementation (accepts any username with a fixed password).
 * Used for quick testing without a real database.
 */
export const loginDemo: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = {
      status: 400,
      body: { error: 'Username and password are required' },
    };
    return;
  }

  // NOTE: In a real implementation you would query the DB.
  // Here we accept any username with password "Password123!" for demo purposes.
  const isValid = password === 'Password123!';

  if (!isValid) {
    context.res = {
      status: 401,
      body: { error: 'Invalid credentials' },
    };
    return;
  }

  const settings = getSettings();

  const token = jwt.sign(
    { sub: username, role: 'user' },
    settings.secret_key,
    { expiresIn: settings.access_token_expire_minutes * 60 }
  );

  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: { access_token: token, token_type: 'bearer' },
  };
};

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

export default loginPassword;

import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../../../shared/services/AuthService'; // adjust import as needed

const login: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const { username, password } = req.body || {};

  // Basic validation (real implementation should verify password securely)
  if (!username || !password) {
    context.res = { status: 400, body: { error: 'Missing credentials' } };
    return;
  }

  const user = await getUserByUsername(username);
  if (!user || user.passwordHash !== password) {
    // In production use proper hash comparison
    context.res = { status: 401, body: { error: 'Invalid credentials' } };
    return;
  }

  // Include role in JWT payload for downstream permission checks
  const tokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwt.sign(tokenPayload, process.env.AUTH_JWT_SECRET!, {
    expiresIn: '1h',
  });

  const refreshToken = jwt.sign({ sub: user.id }, process.env.AUTH_REFRESH_SECRET!, {
    expiresIn: '7d',
  });

  context.res = {
    status: 200,
    body: {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 3600,
    },
  };
};

export default login;
