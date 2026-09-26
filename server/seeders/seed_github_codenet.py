import sys
import os

server_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

from app import app
from database import db
from models import Classroom, Assignment, Submission, Enrollment, User
from seeders.classroom_seeder import seed_classrooms
from seeders.enrollment_seeder import seed_enrollments
from seeders.assignment_seeder import seed_assignments
from seeders.python_submission_seeder import seed_python_submissions
from seeders.java_submission_seeder import seed_java_submissions

def seed_github_codenet():
    with app.app_context():
        print("Starting seed for GitHub / CodeNet Benchmark Classrooms (80+ LOC)...")
        seeded_classes = seed_classrooms(db)
        print(f"Classrooms verified: {[c.name for c in seeded_classes]}")
        
        # Clean up existing assignments for 3CSE and 4CSD to allow clean refresh of problems
        target_class_names = [
            "3CSE - Real-World DSA Benchmark (GitHub / CodeNet)",
            "4CSD - Real-World DSA Benchmark (GitHub / CodeNet)"
        ]
        target_classes = Classroom.query.filter(Classroom.name.in_(target_class_names)).all()
        for tc in target_classes:
            assigns = Assignment.query.filter_by(classroom_id=tc.id).all()
            for a in assigns:
                Submission.query.filter_by(assignment_id=a.id).delete()
                db.session.delete(a)
        db.session.commit()
        print("Cleaned up previous CodeNet assignments/submissions for fresh 80+ LOC reload.")
        
        seed_enrollments(db, seeded_classes)
        print("Enrollments verified.")
        
        seed_assignments(db)
        print("Assignments verified.")
        
        seed_python_submissions(db)
        print("Python submissions seeded.")
        
        seed_java_submissions(db)
        print("Java submissions seeded.")
        
        # Verify 3CSE
        c3cse = Classroom.query.filter_by(name="3CSE - Real-World DSA Benchmark (GitHub / CodeNet)").first()
        if c3cse:
            assignments = Assignment.query.filter_by(classroom_id=c3cse.id).order_by(Assignment.id).all()
            enrollments = Enrollment.query.filter_by(classroom_id=c3cse.id).count()
            sub_count = Submission.query.filter(Submission.assignment_id.in_([a.id for a in assignments])).count() if assignments else 0
            print(f"\nVerified 3CSE (id={c3cse.id}, instructor_id={c3cse.instructor_id}):")
            print(f"  - Enrollments: {enrollments}")
            print(f"  - Total Submissions: {sub_count}")
            for a in assignments:
                cnt = Submission.query.filter_by(assignment_id=a.id).count()
                print(f"    * [{a.id}] {a.title} ({cnt} submissions)")
        
        # Verify 4CSD
        c4csd = Classroom.query.filter_by(name="4CSD - Real-World DSA Benchmark (GitHub / CodeNet)").first()
        if c4csd:
            assignments = Assignment.query.filter_by(classroom_id=c4csd.id).order_by(Assignment.id).all()
            enrollments = Enrollment.query.filter_by(classroom_id=c4csd.id).count()
            sub_count = Submission.query.filter(Submission.assignment_id.in_([a.id for a in assignments])).count() if assignments else 0
            print(f"\nVerified 4CSD (id={c4csd.id}, instructor_id={c4csd.instructor_id}):")
            print(f"  - Enrollments: {enrollments}")
            print(f"  - Total Submissions: {sub_count}")
            for a in assignments:
                cnt = Submission.query.filter_by(assignment_id=a.id).count()
                print(f"    * [{a.id}] {a.title} ({cnt} submissions)")

if __name__ == '__main__':
    seed_github_codenet()
