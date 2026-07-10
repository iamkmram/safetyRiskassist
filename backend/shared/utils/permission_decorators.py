"""Permission Decorators
Convenient decorators for enforcing RBAC on functions.
"""

def requires_permission(permission: str, department: str | None = None):
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Stub: always allow execution  replace with real check
            return func(*args, **kwargs)
        return wrapper
    return decorator

