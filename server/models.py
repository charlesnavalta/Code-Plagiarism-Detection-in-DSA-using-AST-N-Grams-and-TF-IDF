from database import db
from datetime import datetime
from flask_bcrypt import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    # User's permission level ('student', 'instructor', 'admin')
    role = db.Column(db.String(20), nullable=False, default='student') 
    
    # NEW LINE: Tracks if the user is allowed to log in ('active' or 'pending')
    status = db.Column(db.String(20), nullable=False, default='active') 
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def __repr__(self):
        # Updated to show role and status in your terminal logs
        return f'<User {self.username} | Role: {self.role} | Status: {self.status}>'