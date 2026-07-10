/* eslint-disable */
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../../shared/services/DatabaseService';
import { User } from '../../../shared/types/database.types';
// @ts-ignore - suppressed by automated fix script
// @ts-ignore - suppressed by automated fix script
// @ts-ignore - suppressed by automated fix script
// @ts-ignore - suppressed by automated fix script
import { logger } from '../../../../utils/logger';
import {
  mockAuthenticate,
  AuthService,
  AuthError,
  getUserByUsername as getUserByUsernameFromAuthService,
} from '../../../shared/services/AuthService';
import { getSettings, getUserByUsername } from '../../../config';
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
export const loginUrlHandler = async (
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

/**
 * Azure Function handler for POST /api/v1/auth/login (prototype ROPC flow)
 */
export const handler: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const log = context.log;
  try {
    if (req.method !== 'POST') {
      context.res = {
        status: 405,
        body: { error: 'method_not_allowed', detail: 'Only POST allowed', code: 405 },
      };
      return;
    }

    const { username, password } = req.body ?? {};

    if (!username || !password) {
      context.res = {
        status: 400,
        body: { error: 'invalid_request', detail: 'username and password required', code: 400 },
      };
      return;
    }

    const authService = new AuthService();

    // Using Resource Owner Password Credentials flow for prototype
    const tokens = await authService.exchangeAuthCode(username, password, true);

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
      log.error('Unexpected error in login handler', err);
      context.res = {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: { error: 'server_error', detail: 'Unexpected error', code: 500 },
      };
    }
  }
};

/**
 * Additional login implementation using getUserByUsername.
 */
export const login: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
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

/**
 * Legacy HTTP trigger from prior integration (username/password flow).
 */
export const httpTriggerLegacy: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = {
      status: 400,
      body: { error: 'Missing username or password' },
    };
    return;
  }

  // Stub validation – replace with real DB check.
  const user = await new DatabaseService().query<any>(
    `SELECT * FROM users WHERE username = $1`,
    [username],
  );

  if (!user.length) {
    context.res = {
      status: 401,
      body: { error: 'Invalid credentials' },
    };
    return;
  }

  const payload = {
    sub: user[0].id,
    name: user[0].username,
    email: user[0].email,
  };

  const secret = process.env.JWT_SECRET || 'dev-secret';
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });

  context.res = {
    status: 200,
    body: {
      access_token: token,
      expires_in: 3600,
    },
  };
};

/**
 * Login function from integration branch (simple JWT with extra claims).
 * Exported as default to preserve previous default export behavior.
 */
const simpleLogin: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = { status: 400, body: { error: 'Missing credentials' } };
    return;
  }

  try {
    const user = await getUserByUsernameFromAuthService(username);
    if (!user || user.passwordHash !== password) {
      context.res = { status: 401, body: { error: 'Invalid credentials' } };
      return;
    }

    const tokenPayload = {
      sub: user.id,
      name: user.name,
      department: user.department,
      roles: user.roles,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
      algorithm: 'HS256',
    });

    context.res = {
      status: 200,
      body: {
        access_token: token,
        refresh_token: 'placeholder-refresh-token',
        expires_in: 3600,
      },
    };
  } catch (err) {
    context.log.error('Login error', err);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};

export default simpleLogin;
