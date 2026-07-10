from backend.shared.middleware.audit.middleware import AuditMiddleware
from backend.shared.middleware.validation.middleware import ValidationMiddleware
from backend.shared.middleware.rate_limit.middleware import RateLimitMiddleware
from backend.shared.middleware.error_handler.middleware import ErrorHandlerMiddleware
from backend.shared.middleware.cors.middleware import CorsMiddleware
"""
FastAPI application entry point.
Configures middleware stack, registers routers, and sets OpenAPI metadata.
"""

from fastapi import FastAPI, APIRouter

# Middleware helper factories and concrete classes
from backend.shared.middleware.cors.middleware import get_cors_middleware, CORSMiddleware
from backend.shared.middleware.rate_limit.middleware import get_rate_limiter, RateLimitMiddleware
from backend.shared.middleware.validation.middleware import get_validation_middleware, ValidationMiddleware
from backend.shared.middleware.audit.middleware import get_audit_logger, AuditMiddleware
from backend.shared.middleware.error_handler.middleware import register_error_handlers, ErrorHandlerMiddleware

# ----------------------------------------------------------------------
# FastAPI instance with OpenAPI metadata
app = FastAPI(
    title="Enterprise Knowledge API",
    version="0.1.0",
    description="FastAPI backend providing authentication, knowledge search, document handling, and admin operations.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ----------------------------------------------------------------------
# Register concrete middleware classes in the required order
app.add_middleware(ErrorHandlerMiddleware)
app.add_middleware(AuditMiddleware)
app.add_middleware(ValidationMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(CORSMiddleware)

# ----------------------------------------------------------------------
# Additional middleware setup via helper functions (if they perform extra wiring)
get_cors_middleware(app)
get_rate_limiter(app)
get_validation_middleware(app)
get_audit_logger(app)
register_error_handlers(app)

# ----------------------------------------------------------------------
# Placeholder router (replace with actual routers as the project grows)
api_router = APIRouter()

@api_router.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok"}

# Include the API router under the versioned prefix
app.include_router(api_router, prefix="/api/v1")

# ----------------------------------------------------------------------
# Middleware registration (added by automation)
# ----------------------------------------------------------------------
from backend.shared.middleware.cors.middleware import create_cors_middleware
from backend.shared.middleware.rate_limit.middleware import create_rate_limit_middleware
from backend.shared.middleware.validation.middleware import create_validation_middleware
from backend.shared.middleware.audit.middleware import create_audit_middleware
from backend.shared.middleware.error_handler.middleware import register_global_error_handler

# Assuming the FastAPI instance is named `app` in this module.
create_cors_middleware(app)
create_rate_limit_middleware(app)
create_validation_middleware(app)
create_audit_middleware(app)
register_global_error_handler(app)
