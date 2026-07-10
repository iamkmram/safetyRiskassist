"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const healthCheck = async function (context, req) {
    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { status: "ok" },
    };
};
exports.default = healthCheck;
