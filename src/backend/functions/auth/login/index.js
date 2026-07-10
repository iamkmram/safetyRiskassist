"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.handler = exports.loginUrlHandler = exports.loginDemo = exports.loginPassword = exports.httpTrigger = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DatabaseService_1 = require("../../../shared/services/DatabaseService");
const logger_1 = require("../../../../utils/logger");
const AuthService_1 = require("../../../shared/services/AuthService");
const config_1 = require("../../../config");
/**
 * Azure Function HTTP trigger for /auth/login (mock flow).
 *
 * Supports two flows:
 * 1. OAuth code exchange (`?code=...`) – uses AuthService.exchangeCode.
 * 2. Mock authentication (`?provider=...&guest=...`) – uses mockAuthenticate.
 *
 * Returns JSON responses matching the expected contracts.
 */
const httpTrigger = async (context, req) => {
    const code = req.query?.code;
    // Flow 1: Azure AD code exchange
    if (code) {
        try {
            const tokenResponse = await AuthService_1.AuthService.exchangeCode(code);
            context.res = {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
                body: tokenResponse,
            };
        }
        catch (error) {
            context.res = {
                status: 400,
                body: { error: error?.message ?? 'Invalid authorization code' },
            };
        }
        return;
    }
    // Flow 2: Mock authentication
    const provider = req.query.provider || 'microsoft';
    const isGuest = req.query.guest === 'true';
    try {
        const authResult = await (0, AuthService_1.mockAuthenticate)(provider, isGuest);
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
    }
    catch (error) {
        context.log.error('Login mock error:', error);
        context.res = {
            status: 500,
            body: { error: 'Internal Server Error' },
        };
    }
};
exports.httpTrigger = httpTrigger;
/**
 * POST /api/auth/login (real credential verification)
 * Expected body: { email: string, password: string }
 * Returns: { token: string, user: { id, name, department } }
 */
const loginPassword = async (context, req) => {
    logger_1.logger.info('Login request received');
    if (!req.body?.email || !req.body?.password) {
        context.res = {
            status: 400,
            body: { message: 'Email and password are required.' },
        };
        return;
    }
    const { email, password } = req.body;
    try {
        const dbService = await DatabaseService_1.DatabaseService.init(process.env.COSMOS_CONNECTION_STRING);
        const query = `
      SELECT * FROM c WHERE c.email = @mail
    `;
        const users = await dbService.queryItems('users', query, [{ name: '@mail', value: email }]);
        const user = users[0];
        if (!user) {
            context.res = { status: 401, body: { message: 'Invalid credentials.' } };
            return;
        }
        const passwordMatches = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!passwordMatches) {
            context.res = { status: 401, body: { message: 'Invalid credentials.' } };
            return;
        }
        const tokenPayload = { sub: user.id, email: user.email, role: 'user' };
        const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '8h' });
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
    }
    catch (err) {
        logger_1.logger.error('Login handler error:', err);
        context.res = { status: 500, body: { message: 'Internal server error.' } };
    }
};
exports.loginPassword = loginPassword;
/**
 * Demo login implementation (accepts any username with a fixed password).
 * Used for quick testing without a real database.
 */
const loginDemo = async (context, req) => {
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
    const settings = (0, config_1.getSettings)();
    const token = jsonwebtoken_1.default.sign({ sub: username, role: 'user' }, settings.secret_key, { expiresIn: settings.access_token_expire_minutes * 60 });
    context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: { access_token: token, token_type: 'bearer' },
    };
};
exports.loginDemo = loginDemo;
/**
 * AWS Lambda handler for retrieving the Azure AD login URL.
 *
 * Returns JSON containing the URL configured via the AZURE_AD_LOGIN_URL environment variable.
 */
const loginUrlHandler = async (_event) => {
    try {
        const loginUrl = process.env.AZURE_AD_LOGIN_URL ?? '';
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: loginUrl }),
        };
    }
    catch (error) {
        console.error('Login URL fetch error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};
exports.loginUrlHandler = loginUrlHandler;
/**
 * Azure Function handler for POST /api/v1/auth/login (prototype ROPC flow)
 */
const handler = async (context, req) => {
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
        const authService = new AuthService_1.AuthService();
        // Using Resource Owner Password Credentials flow for prototype
        const tokens = await authService.exchangeAuthCode(username, password, true);
        context.res = {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
            body: tokens,
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
            log.error('Unexpected error in login handler', err);
            context.res = {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
                body: { error: 'server_error', detail: 'Unexpected error', code: 500 },
            };
        }
    }
};
exports.handler = handler;
/**
 * Additional login implementation using getUserByUsername.
 */
const login = async (context, req) => {
    const { username, password } = req.body || {};
    // Basic validation (real implementation should verify password securely)
    if (!username || !password) {
        context.res = { status: 400, body: { error: 'Missing credentials' } };
        return;
    }
    const user = await (0, config_1.getUserByUsername)(username);
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
    const accessToken = jsonwebtoken_1.default.sign(tokenPayload, process.env.AUTH_JWT_SECRET, {
        expiresIn: '1h',
    });
    const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id }, process.env.AUTH_REFRESH_SECRET, {
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
exports.login = login;
exports.default = exports.loginPassword;
