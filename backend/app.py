
from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime, pytz

from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer demo_token_"):
            return jsonify({"success": False, "error": "Unauthorized"}), 401
        user_id = auth.replace("Bearer demo_token_", "")
        request.current_user = {"user_id": user_id}
        return f(*args, **kwargs)
    return decorated

app = Flask(__name__)
CORS(app)

print(">>> RUNNING THIS APP.PY <<<")

PROJECTS_DB = {}

@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok"}

@app.route("/api/projects", methods=["POST"])
@token_required
def create_project():
    data = request.json or {}
    if not data.get("name"):
        return {"success": False, "error": "name required"}, 400

    pid = f"project_{len(PROJECTS_DB)+1}"
    project = {
        "id": pid,
        "name": data["name"],
        "description": data.get("description", ""),
        "owner_id": request.current_user["user_id"],
        "created_at": datetime.datetime.now(pytz.UTC).isoformat()
    }
    PROJECTS_DB[pid] = project
    return {"success": True, "project": project}, 201

@app.route("/api/debug/routes", methods=["GET"])
def routes():
    return {"routes": [str(r) for r in app.url_map.iter_rules()]}

if __name__ == "__main__":
    app.run(port=5000, debug=True)
