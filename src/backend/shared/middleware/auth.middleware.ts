// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthError, JwtPayload } from '../services/AuthService';

/**
 * Expressstyle middleware that validates a Bearer JWT.
 * On success, attaches the decoded payload to `req.user`.
 * On failure, responds with 401 using the standardized error schema.
 *
 * Usage (in an Azure Functions HTTP trigger wrapper or any Express app):
 *   app.use(authMiddleware);
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'] ?? req.headers['Authorization'];
    if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
      res.status(401).json({ error: 'unauthorized', detail: 'Missing Authorization header', code: 401 });
      return;
    }

    const token = authHeader.toString().substring('Bearer '.length).trim();
    const authService = new AuthService();
    const payload: JwtPayload = await authService.validateJwt(token);

    // Attach to request for downstream handlers
    (req as any).user = payload;
    next();
  } catch (err: any) {
    if (err instanceof AuthError) {
      res.status(err.code).json({ error: 'auth_error', detail: err.message, code: err.code });
    } else {
      console.error('Unexpected error in auth middleware', err);
      res.status(500).json({ error: 'server_error', detail: 'Unexpected error', code: 500 });
    }
  }
};
