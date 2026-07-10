import { DatabaseService } from '../../../shared/services/DatabaseService';
import { AuthService } from '../../../shared/services/AuthService';
import { Logger } from '../../../shared/utils/Logger';
/**
 * POST /login
 * Expected body: { email: string, password: string }
 * Returns: { token: string, user: { id, email, name, role, department } }
 */
export async function loginHandler(req, res) {
    const { email, password } = req.body;
    // Input validation
    if (!email || !password) {
        Logger.error('Login request missing fields');
        res.status(400).json({ error: 'Email and password are required.' });
        return;
    }
    const db = DatabaseService.getInstance();
    try {
        const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (rows.length === 0) {
            Logger.info('Login failed - unknown email', { email });
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }
        const user = rows[0];
        const passwordMatches = await AuthService.verifyPassword(password, user.password_hash);
        if (!passwordMatches) {
            Logger.info('Login failed - wrong password', { email });
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }
        const token = AuthService.generateToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            department: user.department,
        });
        Logger.info('User logged in successfully', { userId: user.id });
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                department: user.department,
            },
        });
    }
    catch (err) {
        Logger.error('Unexpected error during login', { err });
        res.status(500).json({ error: 'Internal server error.' });
    }
}
