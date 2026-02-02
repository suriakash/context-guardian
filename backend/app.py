from database import Base, engine, SessionLocal
from models.project import Project

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

Base.metadata.create_all(bind=engine)

CORS(app)

#print(">>> RUNNING THIS APP.PY <<<")

@app.route("/api/projects", methods=["GET"])
@token_required
def list_projects():
    user_id = request.current_user.get("user_id")

    db = SessionLocal()
    projects = db.query(Project).filter(
        Project.owner_id == user_id
    ).all()
    db.close()

    return jsonify({
        "success": True,
        "count": len(projects),
        "projects": [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "owner_id": p.owner_id,
                "created_at": p.created_at.isoformat()
            }
            for p in projects
        ]
    }), 200
    
# PROJECTS_DB = {}

@app.route("/api/health", methods=["GET"])
def health():
    return {"status": "ok"}

#
@app.route("/api/projects", methods=["POST"])
@token_required
def create_project():
    data = request.json or {}

    if not data.get("name"):
        return jsonify({
            "success": False,
            "error": "name required"
        }), 400

    db = SessionLocal()

    project = Project(
        id=f"project_{int(datetime.datetime.utcnow().timestamp())}",
        name=data["name"],
        description=data.get("description", ""),
        owner_id=request.current_user["user_id"]
    )

    db.add(project)
    db.commit()
    db.refresh(project)
    db.close()

    return jsonify({
        "success": True,
        "project": {
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "owner_id": project.owner_id,
            "created_at": project.created_at.isoformat()
        }
    }), 201

@app.route("/api/debug/routes", methods=["GET"])
def routes():
    return {"routes": [str(r) for r in app.url_map.iter_rules()]}

if __name__ == "__main__":
    app.run(port=5000, debug=True)
