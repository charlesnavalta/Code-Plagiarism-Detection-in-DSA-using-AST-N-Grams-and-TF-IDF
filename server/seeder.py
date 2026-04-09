from models import User, Classroom, Enrollment
from flask_bcrypt import generate_password_hash 

def run_smart_seed(db):
    """
    Non-destructive seeder for Falsicode.
    Dynamically generates classrooms for all instructors and enrolls all students.
    """
    print("-" * 30)
    print("FALSICODE: Starting Smart Seed...")
    
    try:
        # A. Define User Identity Data (Spaced for readability)
        users_to_seed = [
            # Admin account - only 1 allowed, will be skipped if already exists
            {
                "email": "admin@test.com", 
                "username": "admin", 
                "password": "admin123", 
                "role": "admin"
            },
            # Instructors below - 10 total, each will get their own unique class created for them.
            {
                "email": "renz@gmail.com", 
                "username": "renz", 
                "password": "renz123", 
                "role": "instructor"
            },
            {
                "email": "doca@gmail.com", 
                "username": "doca", 
                "password": "doca123", 
                "role": "instructor"
            },
            {
                "email": "ba@gmail.com", 
                "username": "ba", 
                "password": "ba123", 
                "role": "instructor"
            },
            {
                "email": "janus@gmail.com", 
                "username": "janus", 
                "password": "janus123", 
                "role": "instructor"
            },
            {
                "email": "pat@gmail.com", 
                "username": "pat", 
                "password": "pat123", 
                "role": "instructor"
            },
            {
                "email": "joseph@gmail.com", 
                "username": "joseph", 
                "password": "joseph123", 
                "role": "instructor"
            },
            {
                "email": "mel@gmail.com", 
                "username": "mel", 
                "password": "mel123", 
                "role": "instructor"
            },
            {
                "email": "kier@gmail.com", 
                "username": "kier", 
                "password": "kier123", 
                "role": "instructor"
            },
            {
                "email": "marvin@gmail.com", 
                "username": "marvin", 
                "password": "marvin123", 
                "role": "instructor"
            },
            {
                "email": "vange@gmail.com", 
                "username": "vange", 
                "password": "vange123", 
                "role": "instructor"
            },
            #Students below - 10 total, all enrolled in every class created above.
            {
                "email": "mary@gmail.com", 
                "username": "mary", 
                "password": "mary123", 
                "role": "student"
            },
            {
                "email": "charles@gmail.com", 
                "username": "charles", 
                "password": "charles123", 
                "role": "student"
            },
            {
                "email": "nicolo@gmail.com", 
                "username": "nicolo", 
                "password": "nicolo123", 
                "role": "student"
            },
            {
                "email": "dan@gmail.com", 
                "username": "dan", 
                "password": "dandan", 
                "role": "student"
            },
            {
                "email": "ramon@gmail.com", 
                "username": "ramon", 
                "password": "ramonramon", 
                "role": "student"
            },
            {
                "email": "jude@gmail.com", 
                "username": "jude", 
                "password": "judejude", 
                "role": "student"
            },
            {
                "email": "jm@gmail.com", 
                "username": "jm", 
                "password": "jmjm", 
                "role": "student"
            },
            {
                "email": "patrick@gmail.com", 
                "username": "patrick", 
                "password": "patrickpatrick", 
                "role": "student"
            },
            {
                "email": "rachel@gmail.com", 
                "username": "rachel", 
                "password": "rachelrachel", 
                "role": "student"
            },
            {
                "email": "karo@gmail.com", 
                "username": "karo", 
                "password": "karokaro", 
                "role": "student"
            }
        ]

        # B. Define Explicit Classroom Data
        classrooms_to_seed = [
            {
                "name": "3CSB - DSA", 
                "instructor_username": "renz"
            },
            {
                "name": "Advanced Database Systems", 
                "instructor_username": "doca"
            },
            {
                "name": "Web Development 101", 
                "instructor_username": "ba"
            },
            {
                "name": "Software Engineering II", 
                "instructor_username": "janus"
            },
            {
                "name": "Information Assurance", 
                "instructor_username": "pat"
            },
            {
                "name": "Machine Learning Fundamentals", 
                "instructor_username": "joseph"
            },
            {
                "name": "Operating Systems", 
                "instructor_username": "mel"
            },
            {
                "name": "Data Communications", 
                "instructor_username": "kier"
            },
            {
                "name": "Human Computer Interaction", 
                "instructor_username": "marvin"
            },
            {
                "name": "Mobile App Development", 
                "instructor_username": "vange"
            }
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

        # C. Smart Classroom Seeding (Using Explicit Names)
        seeded_classrooms = []

        for class_data in classrooms_to_seed:
            # 1. Find the specific instructor for this class
            instructor = User.query.filter_by(username=class_data["instructor_username"]).first()
            
            if instructor:
                # 2. Check if this specific class already exists
                existing_class = Classroom.query.filter_by(name=class_data["name"], instructor_id=instructor.id).first()

                if not existing_class:
                    print(f"FALSICODE: Creating Classroom '{class_data['name']}' for {instructor.username}")
                    existing_class = Classroom(
                        name=class_data["name"],
                        instructor_id=instructor.id
                    )
                    db.session.add(existing_class)
                    db.session.flush() # Flush to get the ID before committing
                
                # Keep track for the student enrollment step
                seeded_classrooms.append(existing_class)
            else:
                print(f"FALSICODE WARNING: Could not find instructor '{class_data['instructor_username']}' for class '{class_data['name']}'")
            
        db.session.commit()

        # D. SMART ENROLLMENT SEEDING (Dynamic for ALL Students)
        students = User.query.filter_by(role='student').all()

        # Loop through every classroom we just made...
        for classroom in seeded_classrooms:
            # ...and loop through every student in the database
            for student in students:
                # Check if the student is already in this specific class
                is_enrolled = Enrollment.query.filter_by(
                    student_id=student.id, 
                    classroom_id=classroom.id
                ).first()
                
                if not is_enrolled:
                    print(f"FALSICODE: Enrolling {student.username} in {classroom.name}")
                    enrollment = Enrollment(
                        student_id=student.id, 
                        classroom_id=classroom.id
                    )
                    db.session.add(enrollment)
        
        db.session.commit()

        print("FALSICODE: Smart seeding complete!")
        print("-" * 30)

    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE SEED ERROR: {e}")
        print("-" * 30)