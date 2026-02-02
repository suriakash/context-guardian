from functools import wraps
from flask import request, jsonify

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({
                "success": False,
                "error": "Token is missing"
            }), 401

        token = auth_header.split(' ')[1]

        # Demo token logic (matches your app.py)
        if token.startswith("demo_token_"):
            user_id = token.replace("demo_token_", "")
            request.current_user = {
                "user_id": user_id,
                "role": "user"
            }
            return f(*args, **kwargs)

        return jsonify({
            "success": False,
            "error": "Invalid token"
        }), 401

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        return token_required(f)(*args, **kwargs)
    return decorated


def generate_token(user_id, email, role):
    return f"demo_token_{user_id}"


def verify_token(token):
    return token.startswith("demo_token_")
