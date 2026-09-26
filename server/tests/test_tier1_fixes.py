import os
import io
import sys
import unittest
from datetime import datetime, timedelta

# Add server directory to sys.path
SERVER_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if SERVER_DIR not in sys.path:
    sys.path.insert(0, SERVER_DIR)

from app import create_app
from database import db
from models import User, Classroom, Assignment, AssignmentAttachment, Submission
from flask_jwt_extended import create_access_token


class Tier1FixesTestCase(unittest.TestCase):
    """Automated test suite verifying fixes for all Tier 1 Critical Bugs and Security Vulnerabilities."""

    @classmethod
    def setUpClass(cls):
        os.environ['TESTING'] = 'True'
        os.environ['AUTO_SEED'] = 'false'
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.client = cls.app.test_client()

        cls.app_context = cls.app.app_context()
        cls.app_context.push()

        # Seed test actors once for test class
        cls._setup_test_data()

    @classmethod
    def tearDownClass(cls):
        try:
            db.session.rollback()
            # Clean up test attachments
            attachments = AssignmentAttachment.query.filter(AssignmentAttachment.filename.like('test_%')).all()
            for a in attachments:
                if a.file_path and os.path.exists(a.file_path):
                    try:
                        os.remove(a.file_path)
                    except Exception:
                        pass
                db.session.delete(a)
            db.session.commit()

            Submission.query.filter(Submission.filename.like('test_%')).delete(synchronize_session=False)
            Assignment.query.filter(Assignment.title.like('Test %')).delete(synchronize_session=False)
            Classroom.query.filter(Classroom.name.like('Test Class%')).delete(synchronize_session=False)
            User.query.filter(User.username.like('test_user_%')).delete(synchronize_session=False)
            db.session.commit()
        except Exception:
            db.session.rollback()
        finally:
            cls.app_context.pop()

    @classmethod
    def _setup_test_data(cls):
        # 1. Instructor 1 & Classroom 1
        cls.inst1 = User.query.filter_by(username='test_user_inst1').first()
        if not cls.inst1:
            cls.inst1 = User(username='test_user_inst1', email='test_user_inst1@example.com', role='instructor', status='active', is_verified=True)
            cls.inst1.set_password('Password123!')
            db.session.add(cls.inst1)
            db.session.flush()

        cls.class1 = Classroom.query.filter_by(name='Test Class 1').first()
        if not cls.class1:
            cls.class1 = Classroom(name='Test Class 1', instructor_id=cls.inst1.id)
            db.session.add(cls.class1)
            db.session.flush()

        future_deadline = datetime.utcnow() + timedelta(days=7)
        cls.assign1 = Assignment.query.filter_by(title='Test Assignment 1').first()
        if not cls.assign1:
            cls.assign1 = Assignment(title='Test Assignment 1', description='Test 1', classroom_id=cls.class1.id, language='python', deadline=future_deadline)
            db.session.add(cls.assign1)
            db.session.flush()

        # 2. Instructor 2 & Classroom 2
        cls.inst2 = User.query.filter_by(username='test_user_inst2').first()
        if not cls.inst2:
            cls.inst2 = User(username='test_user_inst2', email='test_user_inst2@example.com', role='instructor', status='active', is_verified=True)
            cls.inst2.set_password('Password123!')
            db.session.add(cls.inst2)
            db.session.flush()

        cls.class2 = Classroom.query.filter_by(name='Test Class 2').first()
        if not cls.class2:
            cls.class2 = Classroom(name='Test Class 2', instructor_id=cls.inst2.id)
            db.session.add(cls.class2)
            db.session.flush()

        cls.assign2 = Assignment.query.filter_by(title='Test Assignment 2').first()
        if not cls.assign2:
            cls.assign2 = Assignment(title='Test Assignment 2', description='Test 2', classroom_id=cls.class2.id, language='python', deadline=future_deadline)
            db.session.add(cls.assign2)
            db.session.flush()

        # 3. Student
        cls.student = User.query.filter_by(username='test_user_student').first()
        if not cls.student:
            cls.student = User(username='test_user_student', email='test_user_student@example.com', role='student', status='active', is_verified=True)
            cls.student.set_password('Password123!')
            db.session.add(cls.student)
            db.session.flush()

        # 4. Attachment in Classroom 2
        cls.attach2 = AssignmentAttachment.query.filter_by(filename='test_guide_2.py').first()
        if not cls.attach2:
            cls.attach2 = AssignmentAttachment(assignment_id=cls.assign2.id, filename='test_guide_2.py', file_path='test_guide_2.py')
            db.session.add(cls.attach2)
            db.session.flush()

        # 5. Submission in Classroom 2
        cls.sub2 = Submission.query.filter_by(filename='test_code_2.py').first()
        if not cls.sub2:
            cls.sub2 = Submission(assignment_id=cls.assign2.id, student_id=cls.student.id, filename='test_code_2.py', file_path='test_code_2.py')
            db.session.add(cls.sub2)
            db.session.flush()

        db.session.commit()

        # Generate JWT tokens
        cls.inst1_token = create_access_token(identity=str(cls.inst1.id))
        cls.inst2_token = create_access_token(identity=str(cls.inst2.id))
        cls.student_token = create_access_token(identity=str(cls.student.id))

    # =========================================================================
    # BUG 1 VERIFICATION: No crash on assignment creation with attachment
    # =========================================================================
    def test_bug1_create_assignment_with_attachments_does_not_crash(self):
        """Verify uploading guide files defines unique_filename and returns 201 without UnboundLocalError."""
        future_dl = (datetime.utcnow() + timedelta(days=5)).isoformat()
        data = {
            'title': 'Test Assignment Guide Upload',
            'description': 'Verifying bug 1 fix',
            'language': 'python',
            'deadline': future_dl,
            'files': (io.BytesIO(b"print('hello world')\n"), 'test_guide_code.py')
        }
        res = self.client.post(
            f'/api/classrooms/{self.class1.id}/assignments',
            data=data,
            content_type='multipart/form-data',
            headers={'Authorization': f'Bearer {self.inst1_token}'}
        )
        self.assertEqual(res.status_code, 201, f"Expected 201 Created but got {res.status_code}: {res.get_json()}")
        body = res.get_json()
        self.assertIn("assignment", body)
        self.assertEqual(body["assignment"]["title"], "Test Assignment Guide Upload")

        # Verify attachment record was created
        created_assign_id = body["assignment"]["id"]
        attachment = AssignmentAttachment.query.filter_by(assignment_id=created_assign_id).first()
        self.assertIsNotNone(attachment, "Attachment record must be created in database")
        self.assertEqual(attachment.filename, "test_guide_code.py")
        self.assertTrue(os.path.basename(attachment.file_path).startswith(f"guide_assign_{created_assign_id}_"))

    # =========================================================================
    # BUG 2 VERIFICATION: Database reseed backdoor removal
    # =========================================================================
    def test_bug2_reseed_backdoor_rejected_without_admin_auth(self):
        """Verify that the hardcoded 'falsicode-reseed-2026' backdoor is completely blocked."""
        # 1. Via X-Reseed-Key header
        res1 = self.client.post(
            '/api/admin/system/reseed',
            json={'mode': 'safe_sync'},
            headers={'X-Reseed-Key': 'falsicode-reseed-2026'}
        )
        self.assertEqual(res1.status_code, 403, "Backdoor header X-Reseed-Key must be rejected with 403!")

        # 2. Via body secret
        res2 = self.client.post(
            '/api/admin/system/reseed',
            json={'mode': 'safe_sync', 'secret': 'falsicode-reseed-2026'}
        )
        self.assertEqual(res2.status_code, 403, "Backdoor body secret must be rejected with 403!")

    # =========================================================================
    # BUG 3 VERIFICATION: Broken Object-Level Authorization (BOLA / IDOR)
    # =========================================================================
    def test_bug3_submissions_idor_prevented(self):
        """Verify Instructor 1 cannot access Classroom 2 submissions using Classroom 1 ID."""
        res = self.client.get(
            f'/api/classrooms/{self.class1.id}/assignments/{self.assign2.id}/submissions',
            headers={'Authorization': f'Bearer {self.inst1_token}'}
        )
        self.assertEqual(res.status_code, 404, "Cross-classroom submission access must return 404!")
        self.assertIn("not found in this classroom", res.get_json().get("error", "").lower())

    def test_bug3_grade_submission_idor_prevented(self):
        """Verify Instructor 1 cannot grade Classroom 2 submissions via Classroom 1 ID."""
        res = self.client.post(
            f'/api/classrooms/{self.class1.id}/assignments/{self.assign2.id}/submissions/{self.sub2.id}/grade',
            json={'score': '95%'},
            headers={'Authorization': f'Bearer {self.inst1_token}'}
        )
        self.assertEqual(res.status_code, 404, "Grading cross-classroom submission must return 404!")

    def test_bug3_comment_submission_idor_prevented(self):
        """Verify Instructor 1 cannot comment on Classroom 2 submissions via Classroom 1 ID."""
        res = self.client.post(
            f'/api/classrooms/{self.class1.id}/assignments/{self.assign2.id}/submissions/{self.sub2.id}/feedback',
            json={'feedback': 'Unauthorized comment'},
            headers={'Authorization': f'Bearer {self.inst1_token}'}
        )
        self.assertEqual(res.status_code, 404, "Commenting on cross-classroom submission must return 404!")

    def test_bug3_allow_resubmit_idor_prevented(self):
        """Verify Instructor 1 cannot unlock resubmission on Classroom 2 submissions via Classroom 1 ID."""
        res = self.client.patch(
            f'/api/classrooms/{self.class1.id}/assignments/{self.assign2.id}/submissions/{self.sub2.id}/allow-resubmit',
            headers={'Authorization': f'Bearer {self.inst1_token}'}
        )
        self.assertEqual(res.status_code, 404, "Unlocking cross-classroom submission must return 404!")

    def test_bug3_attachment_idor_prevented(self):
        """Verify Instructor 1 cannot access Classroom 2 attachment via Classroom 1 route."""
        res = self.client.get(
            f'/api/classrooms/{self.class1.id}/attachments/{self.attach2.id}',
            headers={'Authorization': f'Bearer {self.inst1_token}'}
        )
        self.assertEqual(res.status_code, 404, "Accessing cross-classroom attachment must return 404!")

    def test_bug3_analyze_assignment_unauthorized_student_blocked(self):
        """Verify students cannot trigger plagiarism analysis."""
        res = self.client.post(
            f'/api/analyze/{self.assign1.id}',
            headers={'Authorization': f'Bearer {self.student_token}'}
        )
        self.assertEqual(res.status_code, 403, "Student running plagiarism analysis must be rejected with 403!")

    def test_bug3_analyze_assignment_cross_instructor_blocked(self):
        """Verify Instructor 1 cannot run plagiarism analysis on Classroom 2 assignments."""
        res = self.client.post(
            f'/api/analyze/{self.assign2.id}',
            headers={'Authorization': f'Bearer {self.inst1_token}'}
        )
        self.assertEqual(res.status_code, 403, "Unauthorized instructor auditing another classroom must return 403!")

    # =========================================================================
    # BUG 4 VERIFICATION: Permissive CORS Origin Substring Check
    # =========================================================================
    def test_bug4_cors_rejects_subdomain_and_substring_spoofing(self):
        """Verify CORS does not mirror attacker domains containing 'localhost' or '.vercel.app' as substring."""
        # 1. Attacker domain containing 'localhost'
        res1 = self.client.open(
            '/api/health',
            method='OPTIONS',
            headers={'Origin': 'http://localhost.attacker.com'}
        )
        allowed_origin1 = res1.headers.get('Access-Control-Allow-Origin')
        self.assertNotEqual(allowed_origin1, 'http://localhost.attacker.com', "CORS should not allow attacker domain with substring 'localhost'!")

        # 2. Attacker domain containing '.vercel.app'
        res2 = self.client.open(
            '/api/health',
            method='OPTIONS',
            headers={'Origin': 'https://attacker.com/.vercel.app'}
        )
        allowed_origin2 = res2.headers.get('Access-Control-Allow-Origin')
        self.assertNotEqual(allowed_origin2, 'https://attacker.com/.vercel.app', "CORS should not allow attacker domain with substring '.vercel.app'!")

        # 3. Valid localhost origin should be allowed
        res3 = self.client.open(
            '/api/health',
            method='OPTIONS',
            headers={'Origin': 'http://localhost:3000'}
        )
        self.assertEqual(res3.headers.get('Access-Control-Allow-Origin'), 'http://localhost:3000')

        # 4. Valid vercel origin should be allowed
        res4 = self.client.open(
            '/api/health',
            method='OPTIONS',
            headers={'Origin': 'https://falsicode.vercel.app'}
        )
        self.assertEqual(res4.headers.get('Access-Control-Allow-Origin'), 'https://falsicode.vercel.app')


if __name__ == '__main__':
    unittest.main()
