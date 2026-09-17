"""
=============================================================================
FALSICODE: Modular Seeding Package
=============================================================================
Manages test fixtures, initial administrator setup, and sample DSA submissions.
=============================================================================
"""

from .teardown import wipe_database, wipe_benchmark_data
from .user_seeder import seed_users
from .classroom_seeder import seed_classrooms
from .enrollment_seeder import seed_enrollments
from .assignment_seeder import seed_assignments
from .python_submission_seeder import seed_python_submissions
from .java_submission_seeder import seed_java_submissions


def run_smart_seed(db, mode="safe_sync"):
    """
    Modular seeder orchestrator for Falsicode.
    
    Modes:
      - 'safe_sync' (DEFAULT): Selectively cleans and updates only the benchmark
        classrooms, assignments, and submissions. Preserves all real instructors,
        registered students, user-created classrooms, and production submissions.
      - 'factory_reset': Fully deletes all tables and re-seeds from scratch.
    """
    print("=" * 40)
    print(f"FALSICODE: Starting Modular Smart Seed [Mode: {mode}]...")
    print("=" * 40)
    
    try:
        # 1. Reset target environment according to selected mode
        if mode == "factory_reset":
            wipe_database(db)
        else:
            wipe_benchmark_data(db)
        
        # 2. Rebuild the data in strict relationship order
        seed_users(db)
        seeded_classrooms = seed_classrooms(db)
        seed_enrollments(db, seeded_classrooms)
        seed_assignments(db)
        
        # 3. Seed Submissions separately by language
        seed_python_submissions(db)
        seed_java_submissions(db)
        
        print("=" * 40)
        print(f"SUCCESS: FALSICODE: Smart seeding complete [{mode}]!")
        print("=" * 40)
        
    except Exception as e:
        db.session.rollback()
        print(f"ERROR: FALSICODE SEED ERROR: {e}")
        print("=" * 40)


__all__ = ['run_smart_seed']

