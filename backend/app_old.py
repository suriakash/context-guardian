print(">>> RUNNING THIS APP.PY <<<")
from auth import token_required, admin_required, generate_token, verify_token
from models import USERS_DB, TEAMS_DB, User
import bcrypt
from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import pytz
import random

# Import our mock modules
try:
    from mock_ai import generate_ai_summary, generate_quick_tip
    from mock_calendar import generate_mock_events, get_mock_context
except ImportError:
    # Create simple fallback functions if modules don't exist
    def generate_ai_summary(meeting_title, category="team"):
        return f"🤖 AI Summary for '{meeting_title}' would appear here. Add mock_ai.py for full functionality."
    
    def generate_quick_tip():
        return "Add mock_ai.py for AI tips functionality."
    
    def generate_mock_events(count=10):
        return []
    
    def get_mock_context(meeting_id):
        return {}

app = Flask(__name__)
CORS(app)  # Allow React to connect

# Sample real meeting data
SAMPLE_MEETINGS = [
    {
        "id": "1",
        "title": "Q4 Product Strategy Review",
        "start_time": "2024-01-15T14:00:00",
        "end_time": "2024-01-15T15:30:00",
        "participants": ["alex@company.com", "sam@company.com", "taylor@company.com"],
        "description": "Discuss roadmap for next quarter",
        "calendar": "Primary"
    },
    {
        "id": "2", 
        "title": "Weekly Team Sync",
        "start_time": "2024-01-16T10:00:00",
        "end_time": "2024-01-16T11:00:00",
        "participants": ["team@company.com"],
        "description": "Regular team updates and blockers",
        "calendar": "Work"
    },
    {
        "id": "3",
        "title": "Client Demo - TechCorp",
        "start_time": "2024-01-17T13:00:00",
        "end_time": "2024-01-17T14:30:00",
        "participants": ["client@techcorp.com", "sales@company.com"],
        "description": "Demo new features for client",
        "calendar": "Work"
    }
]

# Sample context data
SAMPLE_CONTEXT = {
    "1": {
        "related_emails": [
            {
                "subject": "Q4 Planning Docs",
                "from": "alex@company.com",
                "date": "2024-01-10",
                "snippet": "Attached the planning document for review. Key points: 1) New feature launch in Feb 2) Budget allocation 3) Team restructuring"
            },
            {
                "subject": "Re: Q4 Strategy",
                "from": "sam@company.com",
                "date": "2024-01-12", 
                "snippet": "I've reviewed the doc. Concern about timeline - we might need to push feature X to March based on current velocity."
            }
        ],
        "related_documents": [
            {
                "name": "Q4_Strategy_Plan.pptx",
                "type": "presentation",
                "last_modified": "2024-01-10",
                "key_points": ["Market expansion", "New hires needed", "Tech debt reduction"]
            }
        ],
        "previous_decisions": [
            "On Jan 5: Decided to prioritize mobile over web",
            "On Dec 20: Approved additional $50K budget for marketing"
        ]
    },
    "2": {
        "related_emails": [
            {
                "subject": "Weekly Sync Agenda",
                "from": "team@company.com",
                "date": "2024-01-15",
                "snippet": "This week's topics: 1) Project updates 2) Blockers 3) Resource allocation"
            }
        ],
        "related_documents": [
            {
                "name": "Team_Progress_Report.pdf",
                "type": "pdf",
                "last_modified": "2024-01-14",
                "key_points": ["Sprint completion: 85%", "Critical bugs: 3", "Upcoming deadlines"]
            }
        ],
        "previous_decisions": [
            "Last week: Implemented new code review process",
            "Two weeks ago: Approved overtime for critical bug fixes"
        ]
    }
}

# ==================== AUTHENTICATION ENDPOINTS ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        company = data.get('company', '')
        
        if not email or not password or not name:
            return jsonify({
                'success': False,
                'error': 'Email, password, and name are required'
            }), 400
        
        # Check if user already exists
        for user_id, user in USERS_DB.items():
            if user.email == email:
                return jsonify({
                    'success': False,
                    'error': 'User with this email already exists'
                }), 409
        
        # Create new user
        new_user_id = f"user{len(USERS_DB) + 1}"
        
        # In production, hash the password with bcrypt
        # For now, we'll simulate it
        password_hash = f"hashed_{password}"
        
        new_user = User(
            id=new_user_id,
            email=email,
            password_hash=password_hash,
            name=name,
            company=company
        )
        
        USERS_DB[new_user_id] = new_user
        
        # Generate token
        token = generate_token(new_user_id, email, 'user')
        
        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user': new_user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'error': 'Email and password are required'
            }), 400
        
        # Find user
        user = None
        user_id = None
        for uid, u in USERS_DB.items():
            if u.email == email:
                user = u
                user_id = uid
                break
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'Invalid credentials'
            }), 401
        
        # Check password (simplified for demo)
        # In production: bcrypt.checkpw(password.encode(), user.password_hash.encode())
        expected_password = f"hashed_{password}"
        if user.password_hash != expected_password:
            # Try default passwords for sample users
            if email == "admin@company.com" and password == "admin123":
                pass  # Allow sample admin login
            elif email == "alex@company.com" and password == "alex123":
                pass  # Allow sample user login
            else:
                return jsonify({
                    'success': False,
                    'error': 'Invalid credentials'
                }), 401
        
        # Generate token
        token = generate_token(user_id, user.email, user.role)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': token
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current user info"""
    try:
        user_id = request.current_user.get('user_id')
        user = USERS_DB.get(user_id)
        
        if not user:
            return jsonify({
                'success': False,
                'error': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/auth/logout', methods=['POST'])
@token_required
def logout():
    """Logout user"""
    # In JWT, logout is client-side (just delete token)
    # For server-side token invalidation, we'd use a token blacklist
    return jsonify({
        'success': True,
        'message': 'Logout successful'
    })

# ==================== CORE ENDPOINTS ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Context Guardian API",
        "version": "1.0.0",
        "timestamp": datetime.datetime.now(pytz.UTC).isoformat()
    })

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({
        "message": "Context Guardian Backend is working!",
        "endpoints": {
            "GET /api/health": "Health check",
            "GET /api/meetings": "Get sample meetings",
            "GET /api/meeting/<id>/context": "Get meeting context",
            "GET /api/meeting/<id>/context/enhanced": "Get AI-enhanced context",
            "GET /api/mock/google-events": "Get mock Google Calendar events",
            "GET /api/ai/tip": "Get AI tip",
            "POST /api/mock/ai-summary": "Generate AI summary"
        }
    })

@app.route('/api/meetings', methods=['GET'])
def get_meetings():
    """Get upcoming meetings"""
    # Add real timestamp
    for meeting in SAMPLE_MEETINGS:
        meeting['fetched_at'] = datetime.datetime.now(pytz.UTC).isoformat()
    
    return jsonify({
        "success": True,
        "meetings": SAMPLE_MEETINGS,
        "count": len(SAMPLE_MEETINGS),
        "source": "sample_data"
    })

@app.route('/api/meeting/<meeting_id>/context', methods=['GET'])
def get_meeting_context(meeting_id):
    """Get context for specific meeting"""
    
    if meeting_id in SAMPLE_CONTEXT:
        context_data = SAMPLE_CONTEXT[meeting_id]
        
        # Create a simple summary
        summary = f"""
        Meeting Context Summary:
        
        • {len(context_data['related_emails'])} relevant emails exchanged
        • Key document: {context_data['related_documents'][0]['name'] if context_data.get('related_documents') else 'None'}
        • Previous decisions: {len(context_data.get('previous_decisions', []))} recorded
        
        Preparation Notes:
        1. Review budget discussion from emails
        2. Address timeline concerns
        3. Mobile prioritization was previously decided
        """
        
        return jsonify({
            "success": True,
            "meeting_id": meeting_id,
            "summary": summary.strip(),
            "data": context_data
        })
    else:
        return jsonify({
            "success": True,
            "meeting_id": meeting_id,
            "summary": "No previous context found for this meeting.",
            "data": {}
        })

# ==================== PROJECTS ENDPOINTS ====================

@app.route('/api/projects', methods=['POST'])
@token_required
def create_project():
    data = request.json or {}

    name = data.get('name')
    description = data.get('description', '')

    if not name:
        return jsonify({
            "success": False,
            "error": "Project name is required"
        }), 400

    project_id = f"project_{len(PROJECTS_DB) + 1}"
    owner_id = request.current_user.get('user_id')

    project = {
        "id": project_id,
        "name": name,
        "description": description,
        "owner_id": owner_id,
        "created_at": datetime.datetime.now(pytz.UTC).isoformat()
    }

    PROJECTS_DB[project_id] = project

    return jsonify({
        "success": True,
        "project": project
    }), 201


# ==================== MOCK INTEGRATION ENDPOINTS ====================

@app.route('/api/mock/google-events', methods=['GET'])
def mock_google_events():
    """Get mock Google Calendar events"""
    try:
        count = request.args.get('count', default=8, type=int)
        events = generate_mock_events(count)
        
        if not events:  # Fallback if mock module not working
            events = []
            for i in range(min(count, 5)):
                start = datetime.datetime.now() + datetime.timedelta(days=i, hours=10)
                end = start + datetime.timedelta(hours=1)
                events.append({
                    "id": f"fallback_{i}",
                    "title": f"Mock Meeting {i+1}",
                    "start_time": start.isoformat(),
                    "end_time": end.isoformat(),
                    "description": "Sample description for mock meeting",
                    "participants": ["user@example.com"],
                    "calendar": "Mock Calendar",
                    "is_mock": True
                })
        
        return jsonify({
            "success": True,
            "source": "Google Calendar (Simulated)",
            "events": events,
            "count": len(events),
            "note": "Using simulated data. Connect real Google Calendar API for production.",
            "mock": True
        })
    except Exception as e:
        print(f"Error in mock_google_events: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/mock/ai-summary', methods=['POST'])
def mock_ai_summary():
    """Generate mock AI summary"""
    try:
        data = request.json
        meeting_title = data.get('title', 'Meeting')
        category = data.get('category', 'team')
        
        summary = generate_ai_summary(meeting_title, category)
        
        return jsonify({
            "success": True,
            "summary": summary,
            "generated_at": datetime.datetime.now(pytz.UTC).isoformat(),
            "model": "GPT-4 (Simulated)",
            "mock": True
        })
    except Exception as e:
        print(f"Error in mock_ai_summary: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/tip', methods=['GET'])
def ai_tip():
    """Get a random AI tip"""
    try:
        tip = generate_quick_tip()
        return jsonify({
            "success": True,
            "tip": tip,
            "source": "AI Assistant (Simulated)",
            "generated_at": datetime.datetime.now(pytz.UTC).isoformat()
        })
    except Exception as e:
        print(f"Error in ai_tip: {e}")
        return jsonify({
            "success": True,
            "tip": "Meetings with clear agendas are 40% more productive. Consider sending the agenda 24 hours in advance.",
            "source": "AI Assistant (Fallback)",
            "generated_at": datetime.datetime.now(pytz.UTC).isoformat()
        })

@app.route('/api/meeting/<meeting_id>/context/enhanced', methods=['GET'])
def get_enhanced_context(meeting_id):
    """Get meeting context with AI enhancement"""
    try:
        # Try to get existing context first
        context_data = None
        meeting_title = "Meeting"
        
        if meeting_id in SAMPLE_CONTEXT:
            context_data = SAMPLE_CONTEXT[meeting_id]
            # Find meeting title
            for meeting in SAMPLE_MEETINGS:
                if meeting['id'] == meeting_id:
                    meeting_title = meeting['title']
                    break
        
        # Generate AI summary
        ai_summary = generate_ai_summary(meeting_title, 'team')
        
        # Create enhanced data
        if context_data:
            enhanced_data = context_data.copy()
        else:
            enhanced_data = {
                "related_emails": [],
                "related_documents": [],
                "previous_decisions": []
            }
        
        # Add AI insights
        enhanced_data['ai_insights'] = {
            "summary": ai_summary,
            "preparation_score": random.randint(70, 95),
            "risk_factors": random.sample(["Timeline pressure", "Multiple stakeholders", "Budget constraints", "Technical complexity", "Team availability"], random.randint(1, 3)),
            "suggested_duration": "Consider shortening to 45 minutes" if random.random() > 0.5 else "Duration seems appropriate",
            "key_stakeholders": random.sample(["Product Manager", "Engineering Lead", "Design Lead", "Client Representative", "Marketing Lead"], random.randint(2, 4)),
            "success_probability": f"{random.randint(70, 95)}%"
        }
        
        return jsonify({
            "success": True,
            "meeting_id": meeting_id,
            "summary": ai_summary,
            "data": enhanced_data,
            "has_ai": True,
            "ai_model": "Simulated GPT-4",
            "mock": True
        })
    except Exception as e:
        print(f"Error in get_enhanced_context: {e}")
        # Fallback response
        return jsonify({
            "success": True,
            "meeting_id": meeting_id,
            "summary": "AI-enhanced context would appear here. Ensure mock_ai.py is in the backend folder.",
            "has_ai": False,
            "data": {}
        })

# ==================== ADDITIONAL UTILITY ENDPOINTS ====================

@app.route('/api/summarize', methods=['POST'])
def summarize_text():
    """Generate summary from text"""
    data = request.json
    text = data.get('text', '')
    
    # Simple summary logic
    sentences = text.split('. ')
    if len(sentences) > 3:
        summary = '. '.join(sentences[:3]) + '...'
    else:
        summary = text
    
    return jsonify({
        "success": True,
        "original_length": len(text),
        "summary": summary,
        "reduction": f"{round((1 - len(summary)/len(text))*100)}%" if text else "0%"
    })

@app.route('/api/system/info', methods=['GET'])
def system_info():
    """Get system information and status"""
    return jsonify({
        "success": True,
        "service": "Context Guardian",
        "version": "1.0.0",
        "status": "operational",
        "integrations": {
            "ai_summarization": {
                "status": "active",
                "mode": "simulated",
                "note": "Using mock AI for demonstration"
            },
            "calendar": {
                "status": "active", 
                "mode": "simulated",
                "note": "Using mock calendar data"
            },
            "context_processing": {
                "status": "active",
                "mode": "real"
            }
        },
        "endpoints": [
            "/api/health",
            "/api/meetings", 
            "/api/meeting/{id}/context",
            "/api/meeting/{id}/context/enhanced",
            "/api/ai/tip",
            "/api/mock/google-events"
        ],
        "uptime": "100%",
        "timestamp": datetime.datetime.now(pytz.UTC).isoformat()
    })

# ==================== MAIN ====================

if __name__ == '__main__':
    print("=" * 60)
    print("CONTEXT GUARDIAN BACKEND - MOCK INTEGRATIONS VERSION")
    print("=" * 60)
    print("\n📡 Server will run at: http://localhost:5000")
    print("\n🔍 Available Endpoints:")
    print("   • GET  /api/health                     - Health check")
    print("   • GET  /api/meetings                   - Sample meetings")
    print("   • GET  /api/meeting/<id>/context       - Meeting context")
    print("   • GET  /api/meeting/<id>/context/enhanced - AI-enhanced context")
    print("   • GET  /api/ai/tip                     - AI tip")
    print("   • GET  /api/mock/google-events         - Mock Google Calendar events")
    print("   • POST /api/mock/ai-summary            - Generate AI summary")
    print("   • GET  /api/system/info                - System information")
    print("\n💡 Note: AI and Calendar integrations are simulated.")
    print("   Add real API keys for production use.")
    print("\n🚀 Starting server...")
    print("=" * 60)
    app.run(debug=True, port=5000)