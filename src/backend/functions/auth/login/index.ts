import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../../shared/services/AuthService';
import { DatabaseService } from '../../../shared/services/DatabaseService';

// ------------------------------------------------------------------
// Azure Function: Login
// ------------------------------------------------------------------

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    context.res = {
      status: 400,
      body: { error: 'Missing username or password' },
    };
    return;
  }

  // ----------------------------------------------------------------
  // 1 Validate credentials - this is a stub; replace with real check.
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------
  // 2 Issue JWT
  // ----------------------------------------------------------------
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

export default httpTrigger;
