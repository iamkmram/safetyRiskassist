import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../../../shared/services/AuthService';

/**
 * Login function - validates credentials and returns a JWT containing
 * additional claims (`name` and `department`).
 */
const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = { status: 400, body: { error: 'Missing credentials' } };
    return;
  }

  try {
    const user = await getUserByUsername(username);
    if (!user || user.passwordHash !== password) {
      context.res = { status: 401, body: { error: 'Invalid credentials' } };
      return;
    }

    const tokenPayload = {
      sub: user.id,
      name: user.name,
      department: user.department,
      roles: user.roles
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
      algorithm: 'HS256'
    });

    context.res = {
      status: 200,
      body: {
        access_token: token,
        refresh_token: 'placeholder-refresh-token',
        expires_in: 3600
      }
    };
  } catch (err) {
    context.log.error('Login error', err);
    context.res = { status: 500, body: { error: 'Internal server error' } };
  }
};

export default httpTrigger;
