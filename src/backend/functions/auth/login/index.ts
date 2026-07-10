import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { AuthService } from '../../../shared/services/AuthService';

const loginFunction: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      context.res = {
        status: 400,
        body: { error: 'InvalidRequest', detail: 'username and password required', code: 400 },
      };
      return;
    }

    const tokens = await AuthService.authenticate(username, password);
    context.res = {
      status: 200,
      body: tokens,
    };
  } catch (err: any) {
    context.log('Login error:', err);
    const status = err.status || 500;
    context.res = {
      status,
      body: { error: err.name || 'ServerError', detail: err.message, code: status },
    };
  }
};

export default loginFunction;
