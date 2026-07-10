export function auditMiddleware(req: any, res: any, next: () => void): void {
  // Simple audit log  replace with structured logging as required
  console.log(`[AUDIT] ${req.method} ${req.url}`);
  next();
}
