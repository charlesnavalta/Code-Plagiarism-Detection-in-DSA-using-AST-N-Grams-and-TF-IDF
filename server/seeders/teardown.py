from models import User, Classroom, Enrollment, Assignment, Submission, AssignmentAttachment

def wipe_database(db):
    print("FALSICODE: Wiping old database records...")
    try:
        # Delete in reverse order of dependencies to prevent Foreign Key constraint crashes
        db.session.query(AssignmentAttachment).delete()
        db.session.query(Submission).delete()
        db.session.query(Assignment).delete()
        db.session.query(Enrollment).delete()
        db.session.query(Classroom).delete()
        db.session.query(User).delete()
        
        db.session.commit()
        print("FALSICODE: Database wiped clean!")
    except Exception as e:
        db.session.rollback()
        print(f"FALSICODE TEARDOWN ERROR: {e}")
        raise e