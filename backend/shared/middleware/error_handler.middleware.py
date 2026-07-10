from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import traceback

class GlobalErrorHandler(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            return await call_next(request)
        except Exception as exc:
            # Capture traceback for debugging (optional)
            tb = traceback.format_exc()
            # Return a generic JSON error response
            return JSONResponse(
                status_code=500,
                content={
                    "detail": "Internal Server Error",
                    "error": str(exc),
                    "traceback": tb,
                },
            )

def add_error_handler(app: FastAPI) -> None:
    app.add_middleware(GlobalErrorHandler)
