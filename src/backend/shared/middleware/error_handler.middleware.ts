// Minimal error handler middleware (no Express types required)
export function errorHandler(err: any, _req: any, res: any, _next: any): void {
  console.error('[ERROR]', err);
  if (res.headersSent) {
    return;
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}
