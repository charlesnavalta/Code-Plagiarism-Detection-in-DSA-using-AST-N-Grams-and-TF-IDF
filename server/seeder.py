from seeders.teardown import wipe_database
from seeders.user_seeder import seed_users
from seeders.classroom_seeder import seed_classrooms
from seeders.enrollment_seeder import seed_enrollments
from seeders.assignment_seeder import seed_assignments
from seeders.python_submission_seeder import seed_python_submissions
from seeders.java_submission_seeder import seed_java_submissions

def run_smart_seed(db):
    """
    Modular seeder for Falsicode.
    Wipes the database and dynamically generates classrooms, enrollments, and assignments.
    """
    print("=" * 40)
    print("🚀 FALSICODE: Starting Modular Smart Seed...")
    print("=" * 40)
    
    try:
        # 1. Reset the environment
        wipe_database(db)
        
        # 2. Rebuild the data in strict relationship order
        seed_users(db)
        seeded_classrooms = seed_classrooms(db)
        seed_enrollments(db, seeded_classrooms)
        seed_assignments(db)
        
        # 3. Seed Submissions separately by language
        seed_python_submissions(db)
        seed_java_submissions(db)
        
        print("=" * 40)
        print("✅ FALSICODE: Smart seeding complete!")
        print("=" * 40)
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ FALSICODE SEED ERROR: {e}")
        print("=" * 40)