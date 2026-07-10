// @ts-ignore
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { AuthService } from '../../../shared/services/AuthService';
// import { HttpResponse } from '@azure/functions';
type HttpResponse = any;

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      context.res = {
        status: 400,
        body: { error: 'Missing credentials', details: null },
      };
      return;
    }

    const tokens = await new AuthService().login(username, password);
    context.res = {
      status: 200,
      body: tokens,
    };
  } catch (err: any) {
    const status = err.statusCode ?? 500;
    const message = err.message ?? 'Internal server error';
    context.res = {
      status,
      body: { error: message, details: err.details || null },
    };
  }
};

export default httpTrigger;
