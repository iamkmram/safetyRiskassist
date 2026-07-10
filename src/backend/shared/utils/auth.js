"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromToken = exports.verifyToken = void 0;
/* eslint-disable */
// Minimal placeholder auth utilities used by the login function
const verifyToken = (token) => true;
exports.verifyToken = verifyToken;
const getUserFromToken = (token) => ({ id: 'system', role: 'admin' });
exports.getUserFromToken = getUserFromToken;
