from models import User, Classroom, Enrollment # Added Enrollment
from flask_bcrypt import generate_password_hash 

def run_smart_seed(db):
    """
    Non-destructive seeder for Falsicode.
    Re-branded to ensure all students are enrolled in Sir Renz's class.
    """
    print("-" * 30)
    print("FALSICODE: Starting Smart Seed...")
    
    try:
        # A. Define User Identity Data
        users_to_seed = [
            {"email": "admin@test.com", "username": "admin", "password": "admin123", "role": "admin"},
            {"email": "renz@gmail.com", "username": "renz", "password": "passpasspass", "role": "instructor"},
            {"email": "charles@gmail.com", "username": "charles", "password": "password123", "role": "student"},
            {"email": "nicolo@gmail.com", "username": "nicolo", "password": "nicolo123", "role": "student"},
            {"email": "dan@gmail.com", "username": "dan", "password": "dandan", "role": "student"},
            {"email": "ramon@gmail.com", "username": "ramon", "password": "ramonramon", "role": "student"}
        ]

        # B. Smart User Seeding
        for u in users_to_seed:
            existing_user = User.query.filter_by(email=u["email"]).first()
            if not existing_user:
                print(f"FALSICODE: Adding {u['role'].capitalize()} account: {u['username']}")
                user = User(
                    email=u["email"],
                    username=u["username"],
                    role=u["role"],
                    status='active'
                )
                user.password = generate_password_hash(u["password"]).decode('utf-8')
                db.session.add(user)
        
        db.session.commit()

        # C. Smart Classroom Seeding
        instructor_renz = User.query.filter_by(email='renz@gmail.com').first()
        dsa_class = Classroom.query.filter_by(name="3CSB - DSA").first()

        if instructor_renz and not dsa_class:
            print("FALSICODE: Creating Classroom '3CSB - DSA' for Sir Renz")
            dsa_class = Classroom(
                name="3CSB - DSA",
                instructor_id=instructor_renz.id
            )
            db.session.add(dsa_class)
            db.session.commit()

        # D. SMART ENROLLMENT SEEDING
        # Now that the class exists, enroll all students automatically
        if dsa_class:
            student_usernames = ["charles", "nicolo", "dan", "ramon"]
            for s_username in student_usernames:
                student = User.query.filter_by(username=s_username).first()
                if student:
                    # Check if the student is already in this specific class
                    is_enrolled = Enrollment.query.filter_by(
                        student_id=student.id, 
                        classroom_id=dsa_class.id
                    ).first()
                    
                    if not is_enrolled:
                        print(f"FALSICODE: Enrolling {s_username} in 3CSB - DSA")
                        enrollment = Enrollment(
                            student_id=student.id, 
                            classroom_id=dsa_class.id
                        )
                        db.session.add(enrollment)
            
            db.session.commit()

        print("FALSICODE: Smart seeding complete!")
        print("-" * 30)

    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE SEED ERROR: {e}")
        print("-" * 30)