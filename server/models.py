import string
import random
from database import db
from datetime import datetime
from flask_bcrypt import generate_password_hash, check_password_hash

# ==========================================
# USER MODEL
# ==========================================
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    # User's permission level ('student', 'instructor', 'admin')
    role = db.Column(db.String(20), nullable=False, default='student') 
    
    # Tracks if the user is allowed to log in ('active' or 'pending')
    status = db.Column(db.String(20), nullable=False, default='active') 
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        # Updated to show role and status in your terminal logs
        return f'<User {self.username} | Role: {self.role} | Status: {self.status}>'


# ==========================================
# CLASSROOM MODEL (Google Classroom Style)
# ==========================================
class Classroom(db.Model):
    __tablename__ = 'classrooms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # 6-character alphanumeric code for students to join (e.g., 'CS9A2X')
    invite_code = db.Column(db.String(6), unique=True, nullable=False)
    
    # Foreign Key: Links the classroom directly to the instructor (User) who created it
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # SQLAlchemy Relationship: This makes it easy to fetch the instructor's details
    # when looking at a classroom (e.g., classroom.instructor.username)
    instructor = db.relationship('User', backref=db.backref('classrooms', lazy=True))

    def __init__(self, name, instructor_id):
        self.name = name
        self.instructor_id = instructor_id
        self.invite_code = self.generate_invite_code()

    def generate_invite_code(self):
        """Generates a random 6-character alphanumeric code and ensures it is completely unique."""
        while True:
            # Picks 6 random uppercase letters and numbers 
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            
            # Check the database to make sure no other class is currently using this exact code
            existing_class = Classroom.query.filter_by(invite_code=code).first()
            if not existing_class:
                return code

    def __repr__(self):
        return f'<Classroom {self.name} | Code: {self.invite_code}>'

# ==========================================
# ASSIGNMENT MODEL
# ==========================================
class Assignment(db.Model):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Foreign Key: Links this assignment strictly to one specific classroom
    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # SQLAlchemy Relationship: Allows you to easily fetch all assignments for a classroom,
    # and cascade="all, delete-orphan" ensures if a teacher deletes a class, 
    # the assignments get deleted automatically!
    classroom = db.relationship('Classroom', backref=db.backref('assignments', lazy=True, cascade="all, delete-orphan"))

    def __init__(self, title, description, classroom_id):
        self.title = title
        self.description = description
        self.classroom_id = classroom_id

    def __repr__(self):
        return f'<Assignment {self.title} | Classroom ID: {self.classroom_id}>'