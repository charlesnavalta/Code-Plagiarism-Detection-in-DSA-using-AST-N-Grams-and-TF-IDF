import string
import random
from database import db
from datetime import datetime
from flask_bcrypt import generate_password_hash, check_password_hash

# ==============================================================================
# 1. USER MODEL (Accounts & Authentication)
# ==============================================================================
class User(db.Model):
    __tablename__ = 'users'

    # --- Core Identifiers ---
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    # --- Roles & Status ---
    # User's permission level ('student', 'instructor', 'admin')
    role = db.Column(db.String(20), nullable=False, default='student') 
    # Tracks if the user is allowed to log in ('active' or 'pending')
    status = db.Column(db.String(20), nullable=False, default='active') 
    
    # --- 🌟 NEW: OTP Verification Columns ---
    # Tracks if the user has successfully entered their 6-digit code
    is_verified = db.Column(db.Boolean, default=False)
    # Stores the currently active 6-digit code (e.g., '592841')
    verification_code = db.Column(db.String(6), nullable=True)
    # Stores the exact exact time the code expires (10 minutes after generation)
    verification_expires = db.Column(db.DateTime, nullable=True)

    # --- Timestamps ---
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # --- Helper Methods ---
    def set_password(self, password):
        """Hashes the password securely before saving it to the database."""
        self.password = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Compares a plain text password against the stored hash."""
        return check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.username} | Role: {self.role} | Verified: {self.is_verified}>'


# ==============================================================================
# 2. CLASSROOM MODEL (Workspace & Grouping)
# ==============================================================================
class Classroom(db.Model):
    __tablename__ = 'classrooms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    # 6-character alphanumeric code for students to join (e.g., 'CS9A2X')
    invite_code = db.Column(db.String(6), unique=True, nullable=False)
    
    # Foreign Key: Links the classroom directly to the instructor (User) who created it
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: If an instructor is deleted, all their classrooms are deleted too
    instructor = db.relationship('User', backref=db.backref('classrooms', lazy=True, cascade="all, delete-orphan"))

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


# ==============================================================================
# 3. ASSIGNMENT MODEL (Tasks & Plagiarism Targets)
# ==============================================================================
class Assignment(db.Model):
    __tablename__ = 'assignments'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    max_score = db.Column(db.Integer, nullable=False, default=100)
    
    # Target language for the Falsicode Engine (e.g., 'python')
    language = db.Column(db.String(50), nullable=False, default='python')
    
    # Foreign Key: Links this assignment strictly to one specific classroom
    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship: If a classroom is deleted, all its assignments are removed
    classroom = db.relationship('Classroom', backref=db.backref('assignments', lazy=True, cascade="all, delete-orphan"))

    def __init__(self, title, description, classroom_id, max_score=100, language='python'):
        self.title = title
        self.description = description
        self.classroom_id = classroom_id
        self.max_score = max_score
        self.language = language

    def __repr__(self):
        return f'<Assignment {self.title} | Lang: {self.language} | Classroom: {self.classroom_id}>'


# ==============================================================================
# 4. ENROLLMENT MODEL (Bridge between Student & Classroom)
# ==============================================================================
class Enrollment(db.Model):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    
    # Links to the Student
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Links to the Classroom
    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships: If a student is deleted, their enrollments disappear cleanly
    student = db.relationship('User', backref=db.backref('enrollments', lazy=True, cascade="all, delete-orphan"))
    classroom = db.relationship('Classroom', backref=db.backref('enrollments', lazy=True))

    def __init__(self, student_id, classroom_id):
        self.student_id = student_id
        self.classroom_id = classroom_id

    def __repr__(self):
        return f'<Enrollment Student: {self.student_id} | Class: {self.classroom_id}>'
    

# ==============================================================================
# 5. SUBMISSION MODEL (Stores the uploaded source code files)
# ==============================================================================
class Submission(db.Model):
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Grading & Metadata
    score = db.Column(db.String(20), nullable=True)
    max_score = db.Column(db.Integer, nullable=True, default=100)
    
    # File Storage Data
    filename = db.Column(db.String(255), nullable=False)  # Original name (e.g., 'dijkstra.py')
    file_path = db.Column(db.String(255), nullable=False) # Server path (e.g., 'uploads/...')
    
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships: If a student or assignment is deleted, wipe the submission record
    assignment = db.relationship('Assignment', backref=db.backref('submissions', lazy=True, cascade="all, delete-orphan"))
    student = db.relationship('User', backref=db.backref('submissions', lazy=True, cascade="all, delete-orphan"))

    def __init__(self, assignment_id, student_id, filename, file_path):
        self.assignment_id = assignment_id
        self.student_id = student_id
        self.filename = filename
        self.file_path = file_path

    def __repr__(self):
        return f'<Submission {self.filename} | Student: {self.student_id} | Assignment: {self.assignment_id}>'