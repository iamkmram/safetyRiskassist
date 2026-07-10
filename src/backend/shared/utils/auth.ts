// Minimal placeholder auth utilities used by the login function
export const verifyToken = (token: string): boolean => true;
export const getUserFromToken = (token: string): any => ({ id: 'system', role: 'admin' });
