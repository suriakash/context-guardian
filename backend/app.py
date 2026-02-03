from database import Base, engine, SessionLocal
from models.project import Project
from models.meeting import Meeting
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

@app.route("/api/projects/<project_id>/meetings", methods=["POST"])
@token_required
def create_meeting(project_id):
    data = request.json or {}

    if not data.get("title"):
        return jsonify({
            "success": False,
            "error": "Meeting title required"
        }), 400

    db = SessionLocal()

    meeting = Meeting(
        id=f"meeting_{int(datetime.datetime.utcnow().timestamp())}",
        title=data["title"],
        project_id=project_id,
        notes=data.get("notes", "")
    )

    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    db.close()

    return jsonify({
        "success": True,
        "meeting": {
            "id": meeting.id,
            "title": meeting.title,
            "project_id": meeting.project_id,
            "notes": meeting.notes,
            "created_at": meeting.created_at.isoformat()
        }
    }), 201

@app.route("/api/projects/<project_id>/meetings", methods=["GET"])
@token_required
def list_project_meetings(project_id):
    db = SessionLocal()

    meetings = db.query(Meeting).filter(
        Meeting.project_id == project_id
    ).all()

    db.close()

    return jsonify({
        "success": True,
        "count": len(meetings),
        "meetings": [
            {
                "id": m.id,
                "title": m.title,
                "project_id": m.project_id,
                "notes": m.notes,
                "created_at": m.created_at.isoformat()
            }
            for m in meetings
        ]
    }), 200


if __name__ == "__main__":
    app.run(port=5000, debug=True)
