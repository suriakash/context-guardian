#import logging
#logging.basicConfig(level=logging.DEBUG)
from pydantic import BaseModel
from fastapi import FastAPI, Depends, HTTPException
from fastapi import UploadFile, File
from backend.schemas import ContextCreate
from backend.models.context_entry import ContextEntry
from sqlalchemy.orm import Session

from backend.database import Base, engine, get_db
from backend.models.user import User
from backend.models.project import Project
from backend.models.project_member import ProjectMember
from backend.models.context_entry import ContextEntry
#from backend.context_guardian.warnings import detect_mismatches
from backend.schemas import (
    UserCreate, UserOut,
    ProjectCreate, ProjectOut,
    ContextCreate, ContextEntryOut
)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# --------------------
# CORS (VERY IMPORTANT)
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# -------- USERS --------

@app.post("/users", response_model=UserOut)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(email=data.email, full_name=data.full_name)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/users", response_model=list[UserOut])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).all()

#@app.get("/users")
#def list_users():
#    return []

# -------- PROJECTS --------

@app.post("/projects/{project_id}/context", response_model=ContextEntryOut)
async def upload_project_context(
    project_id: int,
    main_py: UploadFile = File(...),
    projects_js: UploadFile = File(...),
    projectform_jsx: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    files = {
        "main.py": main_py,
        "projects.js": projects_js,
        "ProjectForm.jsx": projectform_jsx,
    }

    for expected, uploaded in files.items():
        if uploaded.filename != expected:
            raise HTTPException(
                status_code=400,
                detail=f"Expected {expected}, got {uploaded.filename}"
            )

    context_payload = {
        "main.py": main_py_code,
        "projects.js": projects_js_code,
        "ProjectForm.jsx": projectform_jsx_code,
    }
    warnings = detect_mismatches(context_payload)

    entry = ContextEntry(
        project_id=project_id,
        raw_context=context_payload
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry

@app.post("/projects")
def create_project(data: ProjectCreate):
    return {
        "debug": "endpoint reached",
        "name": data.name,
        "owner_id": data.owner_id
    }

#@app.post("/projects")
#def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    # Ensure owner exists
#    owner = db.query(User).filter(User.id == data.owner_id).first()
#    if not owner:
#        raise HTTPException(status_code=404, detail="Owner not found")

#    project = Project(
#        name=data.name,
#        owner_id=data.owner_id
#    )
#    db.add(project)
#    db.commit()
#    db.refresh(project)

# Auto-add owner as project member
#    membership = ProjectMember(
#        user_id=data.owner_id,
#        project_id=project.id
#    )
#    db.add(membership)
#    db.commit()
#    return project
    
@app.get("/projects", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).all()
    return projects


# -------- CONTEXTS --------

@app.post("/contexts", response_model=ContextEntryOut)
def create_context(data: ContextCreate, db: Session = Depends(get_db)):
    context = ContextEntry(
        content=data.content,
        project_id=data.project_id
    )
    db.add(context)
    db.commit()
    db.refresh(context)
    return context


@app.get("/projects/{project_id}/contexts", response_model=list[ContextEntryOut])
def list_contexts(project_id: int, db: Session = Depends(get_db)):
    return (
        db.query(ContextEntry)
        .filter(ContextEntry.project_id == project_id)
        .all()
    )
