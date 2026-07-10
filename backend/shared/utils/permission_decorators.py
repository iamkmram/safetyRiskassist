def require_permission(permission):
    """
    Decorator to enforce that the caller has a given permission.
    Usage:
        @require_permission('read:document')
        def my_view(...):
            ...
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            # In a real implementation, retrieve user context and check permission
            # Here we simply call the function.
            return func(*args, **kwargs)
        return wrapper
    return decorator


def has_permission(user, permission):
    """
    Utility function to check if a user possesses a specific permission.
    Placeholder implementation  always returns True.
    """
    # Real logic would query PermissionService or a DB.
    return True
