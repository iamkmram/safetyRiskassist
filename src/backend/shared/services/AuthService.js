import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/Logger';
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-prod';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
export class AuthService {
    /** Hash a plaintext password */
    static async hashPassword(password) {
        try {
            const hash = await bcrypt.hash(password, SALT_ROUNDS);
            return hash;
        }
        catch (err) {
            Logger.error('Password hashing failed', { err });
            throw err;
        }
    }
    /** Verify password against stored hash */
    static async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        }
        catch (err) {
            Logger.error('Password verification failed', { err });
            throw err;
        }
    }
    /** Generate JWT for a user payload */
    static generateToken(payload) {
        try {
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            return token;
        }
        catch (err) {
            Logger.error('JWT generation failed', { err });
            throw err;
        }
    }
    /** Verify JWT - returns payload or throws */
    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch (err) {
            Logger.error('JWT verification failed', { err });
            throw err;
        }
    }
}
