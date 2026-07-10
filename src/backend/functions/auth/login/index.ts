import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { validateCredentials } from '../../../shared/services/AuthService';
import { generateJwt } from '../../../shared/services/TokenService';

/**
 * HTTP trigger for user login.
 * Expects JSON body: { email: string, password: string }
 * Returns 200 with { token } on success, 400/401 on failure.
 */
const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      context.res = {
        status: 400,
        body: { error: 'Email and password must be strings.' },
      };
      return;
    }

    const isValid = await validateCredentials(email, password);
    if (!isValid) {
      context.res = {
        status: 401,
        body: { error: 'Invalid credentials.' },
      };
      return;
    }

    const token = generateJwt({ email });
    context.res = {
      status: 200,
      body: { token },
    };
  } catch (err) {
    console.error('Login function error:', err);
    context.res = {
      status: 500,
      body: { error: 'Internal server error.' },
    };
  }
};

export default httpTrigger;
