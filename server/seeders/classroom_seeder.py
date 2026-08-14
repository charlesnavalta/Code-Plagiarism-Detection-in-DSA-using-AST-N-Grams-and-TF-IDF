from models import Classroom, User

classrooms_to_seed = [
    {"name": "3CSB - Different Scenarios", "instructor_username": "Renz"},
    {"name": "3CSC - Multiple Files", "instructor_username": "Renz"},
    {"name": "4CSA - Different Scenarios", "instructor_username": "Ba"},
    {"name": "4CSB - Multiple Files", "instructor_username": "Ba"},
]

def seed_classrooms(db):
    print("FALSICODE: Seeding Classrooms...")
    seeded_classrooms = []
    
    for class_data in classrooms_to_seed:
        instructor = User.query.filter_by(username=class_data["instructor_username"]).first()
        if instructor:
            existing_class = Classroom.query.filter_by(name=class_data["name"], instructor_id=instructor.id).first()
            if not existing_class:
                new_class = Classroom(name=class_data["name"], instructor_id=instructor.id)
                db.session.add(new_class)
                db.session.flush() # Flush to get ID
                seeded_classrooms.append(new_class)
            else:
                seeded_classrooms.append(existing_class)
        else:
            print(f"WARNING: Instructor {class_data['instructor_username']} not found.")
            
    db.session.commit()
    return seeded_classrooms