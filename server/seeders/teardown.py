"""
=============================================================================
FALSICODE: Database Teardown & Benchmark Scope Isolation
=============================================================================
Provides both:
  1. wipe_benchmark_data: Non-destructive cleanup of only benchmark classrooms.
     Preserves all real registered students, real instructors, real classrooms,
     and live student submissions!
  2. wipe_database: Full factory reset for development/testing environments.
=============================================================================
"""

from models import User, Classroom, Enrollment, Assignment, Submission, AssignmentAttachment
from utils.file_manager import cleanup_classroom_files

BENCHMARK_CLASSROOM_NAMES = [
    "3CSB - Different Scenarios",
    "3CSC - Multiple Files",
    "3CSD - DSA Clone Benchmarks",
    "4CSA - Different Scenarios",
    "4CSB - Multiple Files",
    "4CSC - DSA Clone Benchmarks (Java)",
]


def wipe_benchmark_data(db):
    """
    SAFE SCOPE (Dataset Sync):
    Removes ONLY the benchmark classrooms and their associated assignments and submissions.
    NEVER deletes any user-created classrooms, real instructor accounts, real student accounts,
    or live student submissions.
    """
    print("FALSICODE: Performing Safe Benchmark Dataset Cleanup...")
    try:
        benchmark_classes = Classroom.query.filter(Classroom.name.in_(BENCHMARK_CLASSROOM_NAMES)).all()
        for b_class in benchmark_classes:
            # 1. Clean up physical files on disk for this benchmark classroom
            cleanup_classroom_files(b_class.id)

            # 2. Get assignment IDs
            assign_ids = [a.id for a in b_class.assignments]
            if assign_ids:
                AssignmentAttachment.query.filter(AssignmentAttachment.assignment_id.in_(assign_ids)).delete(synchronize_session=False)
                Submission.query.filter(Submission.assignment_id.in_(assign_ids)).delete(synchronize_session=False)
                Assignment.query.filter(Assignment.id.in_(assign_ids)).delete(synchronize_session=False)

            # 3. Clean up enrollments for this benchmark classroom
            Enrollment.query.filter_by(classroom_id=b_class.id).delete(synchronize_session=False)

            # 4. Delete the benchmark classroom
            db.session.delete(b_class)

        db.session.commit()
        print(f"FALSICODE: Cleaned up {len(benchmark_classes)} benchmark classrooms. Real user data was preserved!")
    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE BENCHMARK TEARDOWN ERROR: {e}")
        raise e


def wipe_database(db):
    """
    FULL FACTORY RESET (Destructive):
    Wipes all records across all tables. Only used for dev testing or explicit factory reset.
    """
    print("FALSICODE: Wiping ALL database records (Factory Reset)...")
    try:
        # Delete in reverse order of dependencies to prevent Foreign Key constraint crashes
        db.session.query(AssignmentAttachment).delete()
        db.session.query(Submission).delete()
        db.session.query(Assignment).delete()
        db.session.query(Enrollment).delete()
        db.session.query(Classroom).delete()
        db.session.query(User).delete()
        
        db.session.commit()
        print("FALSICODE: Full database factory reset completed!")
    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE FULL TEARDOWN ERROR: {e}")
        raise e