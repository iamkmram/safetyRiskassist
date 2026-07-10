import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DatabaseService } from '../../../../shared/services/DatabaseService';
import { PermissionService } from '../../../../shared/services/PermissionService';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const JWT_EXPIRES_IN = '1h'; // 1 hour

/**
 * Lambda entry point for user login.
 * Validates input, checks credentials, issues JWT and logs the event.
 */
export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      return response(400, { message: 'Request body is required.' });
    }

    const { email, password } = JSON.parse(event.body);

    // Input validation
    if (!email || !password) {
      return response(400, { message: 'Both email and password are required.' });
    }

    const db = DatabaseService.getInstance();
    const user = await db.queryOne(
      'SELECT id, email, password_hash, full_name FROM users WHERE email = $1',
      [email]
    );

    if (!user) {
      return response(401, { message: 'Invalid credentials.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return response(401, { message: 'Invalid credentials.' });
    }

    // Optional: fetch permissions for the token payload
    const permissions = await PermissionService.getUserPermissions(user.id);

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      fullName: user.full_name,
      perms: permissions,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Audit log (could be replaced by a dedicated service)
    console.log(
      JSON.stringify({
        action: 'login',
        userId: user.id,
        timestamp: new Date().toISOString(),
        ip: event.requestContext.identity?.sourceIp,
      })
    );

    return response(200, { token });
  } catch (error) {
    console.error('Login handler error:', error);
    return response(500, { message: 'Internal server error.' });
  }
};

function response(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}
