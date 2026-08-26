from models import User, Enrollment

def seed_enrollments(db, seeded_classrooms):
    print("FALSICODE: Seeding Enrollments...")
    students = User.query.filter_by(role='student').all()
    existing_enrollments = {(e.student_id, e.classroom_id) for e in Enrollment.query.all()}

    for classroom in seeded_classrooms:
        for student in students:
            if (student.id, classroom.id) not in existing_enrollments:
                enrollment = Enrollment(student_id=student.id, classroom_id=classroom.id)
                db.session.add(enrollment)
                existing_enrollments.add((student.id, classroom.id))
                
    db.session.commit()