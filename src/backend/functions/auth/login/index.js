"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("../../../shared/services/AuthService");
const httpTrigger = async (context, req) => {
    try {
        const { username, password } = req.body || {};
        if (!username || !password) {
            context.res = {
                status: 400,
                body: { error: 'Missing credentials', details: null },
            };
            return;
        }
        const tokens = await new AuthService_1.AuthService().login(username, password);
        context.res = {
            status: 200,
            body: tokens,
        };
    }
    catch (err) {
        const status = err.statusCode ?? 500;
        const message = err.message ?? 'Internal server error';
        context.res = {
            status,
            body: { error: message, details: err.details || null },
        };
    }
};
exports.default = httpTrigger;
