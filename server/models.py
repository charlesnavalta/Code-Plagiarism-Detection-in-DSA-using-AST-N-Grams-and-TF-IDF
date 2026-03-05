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
    max_score = db.Column(db.Integer, nullable=False, default=100)
    
    # Foreign Key: Links this assignment strictly to one specific classroom
    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # SQLAlchemy Relationship: Allows you to easily fetch all assignments for a classroom,
    # and cascade="all, delete-orphan" ensures if a teacher deletes a class, 
    # the assignments get deleted automatically!
    classroom = db.relationship('Classroom', backref=db.backref('assignments', lazy=True, cascade="all, delete-orphan"))

    def __init__(self, title, description, classroom_id, max_score=100):
        self.title = title
        self.description = description
        self.classroom_id = classroom_id
        self.max_score = max_score

    def __repr__(self):
        return f'<Assignment {self.title} | Classroom ID: {self.classroom_id}>'

# ==========================================
# ENROLLMENT MODEL (Bridge between Student & Classroom)
# ==========================================
class Enrollment(db.Model):
    __tablename__ = 'enrollments'

    id = db.Column(db.Integer, primary_key=True)
    
    # Links to the Student
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Links to the Classroom
    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

    # SQLAlchemy Relationships
    student = db.relationship('User', backref=db.backref('enrollments', lazy=True))
    classroom = db.relationship('Classroom', backref=db.backref('enrollments', lazy=True))

    def __init__(self, student_id, classroom_id):
        self.student_id = student_id
        self.classroom_id = classroom_id

    def __repr__(self):
        return f'<Enrollment Student: {self.student_id} | Class: {self.classroom_id}>'
    
# ==========================================
# SUBMISSION MODEL (Stores the .py files)
# ==========================================
class Submission(db.Model):
    __tablename__ = 'submissions'

    id = db.Column(db.Integer, primary_key=True)
    
    # Links to the Assignment
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignments.id'), nullable=False)
    # Links to the Student
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Optional score field to store the result of plagiarism analysis or manual grading
    score = db.Column(db.String(20), nullable=True)
    # Maximum score for the assignment (e.g., 100 points) - this can be used for grading purposes
    max_score = db.Column(db.Integer, nullable=True, default=100)
    # Stores the original file name (e.g., 'dijkstra_algo.py')
    filename = db.Column(db.String(255), nullable=False)
    
    # Stores the actual location on the server (e.g., 'uploads/student_1_assign_2_dijkstra.py')
    file_path = db.Column(db.String(255), nullable=False)
    
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    # SQLAlchemy Relationships
    assignment = db.relationship('Assignment', backref=db.backref('submissions', lazy=True, cascade="all, delete-orphan"))
    student = db.relationship('User', backref=db.backref('submissions', lazy=True))

    def __init__(self, assignment_id, student_id, filename, file_path):
        self.assignment_id = assignment_id
        self.student_id = student_id
        self.filename = filename
        self.file_path = file_path

    def __repr__(self):
        return f'<Submission {self.filename} | Student: {self.student_id} | Assignment: {self.assignment_id}>'