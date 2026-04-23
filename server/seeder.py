from models import User, Classroom, Enrollment, Assignment, Submission
from flask_bcrypt import generate_password_hash 

def run_smart_seed(db):
    """
    Non-destructive seeder for Falsicode.
    Dynamically generates classrooms, enrolls students, and creates assignments.
    """
    print("-" * 30)
    print("FALSICODE: Starting Smart Seed...")
    
    try:
        # A. Define User Identity Data (Spaced for readability)
        users_to_seed = [
            # Admin account
            {
                "email": "admin@test.com", 
                "username": "admin", 
                "password": "admin123", 
                "role": "admin"
            },
            # Instructors
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
            # Students
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

        # C. Explicit Assignment Data
        assignments_to_seed = [
            {
                "title": "1. Quick Sort Implementation",
                "description": "Write a Python script that implements the Quick Sort algorithm. You must include a partition helper function.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python"
            },
            {
                "title": "2. Merge Sort Implementation",
                "description": "Implement the Merge Sort algorithm using a recursive divide-and-conquer approach. Ensure your code handles lists of both even and odd lengths.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python"
            },
            {
                "title": "3. Singly Linked List",
                "description": "Develop a Node class and a LinkedList class. Implement methods to append a node, prepend a node, and reverse the entire linked list in place.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python"
            },
            {
                "title": "4. Basic Binary Tree Traversals",
                "description": "Construct a basic Binary Tree. Implement and print the results of pre-order, in-order, and post-order traversals for a tree with at least 7 nodes.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python"
            },
            {
                "title": "5. Binary Search Tree (BST) Operations",
                "description": "Implement a fully functional Binary Search Tree. Your script must include methods to insert a new value, search for an existing value, and delete a leaf node.",
                "max_score": 100,
                "classroom_name": "3CSB - DSA",
                "language": "python"
            },
        ]

        # D. Explicit Submission Data (Pointing to Physical Files in the Datasets Folder)
        submissions_to_seed = [

            #Assignment 1 Submissions - Quick Sort Implementation
            
            {
                "student_username": "charles",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "original.py",
                "file_path": "datasets/python_source-code/quick_sort/original.py"
            },
            {
                "student_username": "nicolo",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_1_exact_of_structucal4.py",
                "file_path": "datasets/python_source-code/quick_sort/type_1_exact_of_structucal4.py"
            },
            {
                "student_username": "dan",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_2_renamed_of_Structural4.py",
                "file_path": "datasets/python_source-code/quick_sort/type_2_renamed_of_Structural4.py"
            },
            {
                "student_username": "mary",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_2_renamed.py",
                "file_path": "datasets/python_source-code/quick_sort/type_2_renamed.py"
            },
            {
                "student_username": "ramon",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_2_renamed2.py",
                "file_path": "datasets/python_source-code/quick_sort/type_2_renamed2.py"
            },
            {
                "student_username": "jude",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_3_structural.py",
                "file_path": "datasets/python_source-code/quick_sort/type_3_structural.py"
            },
            {
                "student_username": "jm",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_3_structural2.py",
                "file_path": "datasets/python_source-code/quick_sort/type_3_structural2.py"
            },
            {
                "student_username": "patrick",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_3_structural3.py",
                "file_path": "datasets/python_source-code/quick_sort/type_3_structural3.py"
            },
            {
                "student_username": "rachel",
                "assignment_title": "1. Quick Sort Implementation",
                "filename": "type_3_structural4.py",
                "file_path": "datasets/python_source-code/quick_sort/type_3_structural4.py"
            },

            # Assignment 2 Submissions - Merge Sort Implementation

            {
                "student_username": "charles",
                "assignment_title": "2. Merge Sort Implementation",
                "filename": "original.py",
                "file_path": "datasets/python_source-code/merge_sort/original.py"
            },
            {
                "student_username": "nicolo",
                "assignment_title": "2. Merge Sort Implementation",
                "filename": "type_1_exact.py",
                "file_path": "datasets/python_source-code/merge_sort/type_1_exact.py"
            },
            {
                "student_username": "dan",
                "assignment_title": "2. Merge Sort Implementation",
                "filename": "type_2_renamed.py",
                "file_path": "datasets/python_source-code/merge_sort/type_2_renamed.py"
            },
            {
                "student_username": "ramon",
                "assignment_title": "2. Merge Sort Implementation",
                "filename": "type_2_renamed2.py",
                "file_path": "datasets/python_source-code/merge_sort/type_2_renamed2.py"
            },
            {
                "student_username": "karo",
                "assignment_title": "2. Merge Sort Implementation",
                "filename": "type_3_structural.py",
                "file_path": "datasets/python_source-code/merge_sort/type_3_structural.py"
            },
            {
                "student_username": "rachel",
                "assignment_title": "2. Merge Sort Implementation",
                "filename": "type_3_structural2.py",
                "file_path": "datasets/python_source-code/merge_sort/type_3_structural2.py"
            },

            # Assignment 3 Submissions - Singly Linked List

            {
                "student_username": "mary",
                "assignment_title": "3. Singly Linked List",
                "filename": "original.py",
                "file_path": "datasets/python_source-code/linked_list/original.py"
            },
            {
                "student_username": "ramon",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_1_exact.py",
                "file_path": "datasets/python_source-code/linked_list/type_1_exact.py"
            },
            {
                "student_username": "rachel",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_2_renamed.py",
                "file_path": "datasets/python_source-code/linked_list/type_2_renamed.py"
            },
            {
                "student_username": "karo",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_2_renamed2.py",
                "file_path": "datasets/python_source-code/linked_list/type_2_renamed2.py"
            },
            {
                "student_username": "jm",
                "assignment_title": "3. Singly Linked List",
                "filename": "type_3_structural.py",
                "file_path": "datasets/python_source-code/linked_list/type_3_structural.py"
            },
        ]

        # 1. Smart User Seeding
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

        # 2. Smart Classroom Seeding (Using Explicit Names)
        seeded_classrooms = []

        for class_data in classrooms_to_seed:
            instructor = User.query.filter_by(username=class_data["instructor_username"]).first()
            
            if instructor:
                existing_class = Classroom.query.filter_by(name=class_data["name"], instructor_id=instructor.id).first()

                if not existing_class:
                    print(f"FALSICODE: Creating Classroom '{class_data['name']}' for {instructor.username}")
                    existing_class = Classroom(
                        name=class_data["name"],
                        instructor_id=instructor.id
                    )
                    db.session.add(existing_class)
                    db.session.flush() # Flush to get the ID before committing
                
                seeded_classrooms.append(existing_class)
            else:
                print(f"FALSICODE WARNING: Could not find instructor '{class_data['instructor_username']}'")
            
        db.session.commit()

        # 3. SMART ENROLLMENT SEEDING (Dynamic for ALL Students)
        students = User.query.filter_by(role='student').all()

        for classroom in seeded_classrooms:
            for student in students:
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

        # 4. SMART ASSIGNMENT SEEDING (NEW SECTION)
        for assign_data in assignments_to_seed:
            # Find the classroom by its name
            classroom = Classroom.query.filter_by(name=assign_data["classroom_name"]).first()
            
            if classroom:
                # Check if this assignment already exists in this classroom
                existing_assignment = Assignment.query.filter_by(
                    title=assign_data["title"], 
                    classroom_id=classroom.id
                ).first()
                
                if not existing_assignment:
                    print(f"FALSICODE: Adding Assignment '{assign_data['title']}' to {classroom.name}")
                    new_assignment = Assignment(
                        title=assign_data["title"],
                        description=assign_data["description"],
                        max_score=assign_data["max_score"],
                        classroom_id=classroom.id
                    )
                    db.session.add(new_assignment)
            else:
                print(f"FALSICODE WARNING: Classroom '{assign_data['classroom_name']}' not found for assignment seeding.")
                
        db.session.commit()

        # 5. SMART SUBMISSION SEEDING (NEW SECTION)
        for sub_data in submissions_to_seed:
            # Look up the student and assignment
            student = User.query.filter_by(username=sub_data["student_username"]).first()
            assignment = Assignment.query.filter_by(title=sub_data["assignment_title"]).first()

            if student and assignment:
                # Check if this student already submitted a file for this exact assignment
                existing_sub = Submission.query.filter_by(
                    student_id=student.id, 
                    assignment_id=assignment.id
                ).first()

                if not existing_sub:
                    print(f"FALSICODE: Seeding Submission '{sub_data['filename']}' for {student.username}")
                    new_submission = Submission(
                        assignment_id=assignment.id,
                        student_id=student.id,
                        filename=sub_data["filename"],
                        file_path=sub_data["file_path"]
                    )
                    db.session.add(new_submission)
            else:
                print(f"FALSICODE WARNING: Could not find Student or Assignment for '{sub_data['filename']}'")
        
        db.session.commit()

        print("FALSICODE: Smart seeding complete!")
        print("-" * 30)

    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE SEED ERROR: {e}")
        print("-" * 30)