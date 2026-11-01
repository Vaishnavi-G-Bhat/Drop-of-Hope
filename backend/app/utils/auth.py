from functools import wraps

from flask import session

from .responses import error_response


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if 'user_id' not in session:
            return error_response('UNAUTHENTICATED', 'Authentication required.', 401)
        return view(*args, **kwargs)

    return wrapped


def role_required(*roles):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            user_role = session.get('role')
            if not user_role or user_role not in roles:
                return error_response('FORBIDDEN', 'You do not have permission to access this resource.', 403)
            return view(*args, **kwargs)

        return wrapped

    return decorator
