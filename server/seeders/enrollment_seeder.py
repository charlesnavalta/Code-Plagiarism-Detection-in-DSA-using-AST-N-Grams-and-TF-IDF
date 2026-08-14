from models import User, Enrollment

def seed_enrollments(db, seeded_classrooms):
    print("FALSICODE: Seeding Enrollments...")
    students = User.query.filter_by(role='student').all()

    for classroom in seeded_classrooms:
        for student in students:
            is_enrolled = Enrollment.query.filter_by(student_id=student.id, classroom_id=classroom.id).first()
            if not is_enrolled:
                enrollment = Enrollment(student_id=student.id, classroom_id=classroom.id)
                db.session.add(enrollment)
                
    db.session.commit()