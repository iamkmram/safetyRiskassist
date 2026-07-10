"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AuthService_1 = require("../../../shared/services/AuthService");
/**
 * Azure Function handler for GET /api/v1/auth/profile
 * Requires Authorization: Bearer <jwt>
 * Returns: { sub, email, name, roles }
 */
const handler = async (context, req) => {
    try {
        if (req.method !== 'GET') {
            context.res = {
                status: 405,
                body: { error: 'method_not_allowed', detail: 'Only GET allowed', code: 405 },
            };
            return;
        }
        const authHeader = req.headers['authorization'] ?? req.headers['Authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            context.res = {
                status: 401,
                body: { error: 'unauthorized', detail: 'Missing or malformed Authorization header', code: 401 },
            };
            return;
        }
        const token = authHeader.substring('Bearer '.length).trim();
        const authService = new AuthService_1.AuthService();
        const payload = await authService.validateJwt(token);
        // Build profile response (only expose safe fields)
        const profile = {
            sub: payload.sub,
            email: payload.email ?? '',
            name: payload.name ?? '',
            roles: payload.roles ?? [],
        };
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: profile,
        };
    }
    catch (err) {
        if (err instanceof AuthService_1.AuthError) {
            context.res = {
                status: err.code,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'auth_error', detail: err.message, code: err.code },
            };
        }
        else {
            context.log?.error('Unexpected error in profile handler', err);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'server_error', detail: 'Unexpected error', code: 500 },
            };
        }
    }
    return;
    ;
};
exports.handler = handler;
