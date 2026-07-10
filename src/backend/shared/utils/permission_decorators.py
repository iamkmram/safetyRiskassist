from functools import wraps
from fastapi import Request, HTTPException

# ------------------------------------------------------------------
# Permission decorator - validates that the required permission exists
# ------------------------------------------------------------------

def require_permission(permission_key: str, resource_id_param: str | None = None):
    """
    FastAPI route decorator.
    :param permission_key: The permission identifier (e.g., "knowledge.read").
    :param resource_id_param: Name of a function argument that contains the
                              resource identifier to be scoped (optional).
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # FastAPI injects the Request object either as a positional
            # argument or as a keyword argument - locate it.
            request: Request | None = None
            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                    break
            if request is None:
                request = kwargs.get("request")
            if request is None:
                raise HTTPException(status_code=500, detail="Request object not found in route parameters")

            # Permissions were attached by AuthorizationMiddleware
            permissions = getattr(request.state, "permissions", [])
            if not any(p["key"] == permission_key for p in permissions):
                raise HTTPException(status_code=403, detail="Insufficient permission")

            # If a resourcescoped check is required, fetch the ID from kwargs
            if resource_id_param:
                resource_id = kwargs.get(resource_id_param)
                if not any(
                    p["key"] == permission_key and p.get("resource_id") == resource_id
                    for p in permissions
                ):
                    raise HTTPException(status_code=403, detail="Insufficient permission for the requested resource")

            return await func(*args, **kwargs)
        return wrapper
    return decorator
