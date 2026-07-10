import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../../../shared/services/DatabaseService';
import { User } from '../../../shared/types/database.types';
import { logger } from '../../../../utils/logger';

/**
 * POST /api/auth/login
 * Expected body: { email: string, password: string }
 * Returns: { token: string, user: { id, name, department } }
 */
const login: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
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
  } catch (err:any) {
    logger.error('Login handler error:', err);
    context.res = { status: 500, body: { message: 'Internal server error.' } };
  }
};

export default login;
