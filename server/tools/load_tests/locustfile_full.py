import os
import random
from locust import HttpUser, task, between

class StudentBehavior(HttpUser):
    weight = 5 # 5 times more students than instructors
    wait_time = between(2, 5)
    
    def on_start(self):
        self.token = None
        self.class_id = os.environ.get('TEST_CLASS_ID', '1')
        self.assignment_id = os.environ.get('TEST_ASSIGNMENT_ID', '1')
        self.student_email = os.environ.get('TEST_STUDENT_EMAIL', 'test1@example.com')
        self.student_password = os.environ.get('TEST_STUDENT_PASSWORD', 'password123')

        response = self.client.post('/api/auth/login', json={
            'email': self.student_email,
            'password': self.student_password
        }, name="/api/auth/login (Student)")

        if response.status_code == 200:
            self.token = response.json().get('access_token')
            self.headers = {'Authorization': f'Bearer {self.token}'}

    @task(3)
    def submit_code(self):
        if not self.token: return
        file_path = os.path.join(os.path.dirname(__file__), 'sample_submission.py')
        try:
            with open(file_path, 'rb') as f:
                files = {'file': ('sample_submission.py', f, 'text/x-python')}
                with self.client.post(
                    f'/api/classrooms/{self.class_id}/assignments/{self.assignment_id}/submit', 
                    headers=self.headers,
                    files=files,
                    name='/api/.../submit (Student)',
                    catch_response=True
                ) as response:
                    if response.status_code not in [200, 201]:
                        response.failure(f"Submit failed: {response.text}")
        except FileNotFoundError:
            pass

    @task(1)
    def view_assignments(self):
        if not self.token: return
        with self.client.get(f'/api/classrooms/{self.class_id}/assignments', headers=self.headers, name='/api/.../assignments (Student)', catch_response=True) as response:
            if response.status_code not in [200, 201]:
                response.failure(f"View failed: {response.text}")


class InstructorBehavior(HttpUser):
    weight = 1 # 1 instructor per 5 students
    wait_time = between(5, 10) # Instructors move slower
    
    def on_start(self):
        self.token = None
        self.assignment_id = os.environ.get('TEST_ASSIGNMENT_ID', '1')
        self.instructor_email = os.environ.get('TEST_INSTRUCTOR_EMAIL', 'tami')
        self.instructor_password = os.environ.get('TEST_INSTRUCTOR_PASSWORD', 'tami123')

        response = self.client.post('/api/auth/login', json={
            'email': self.instructor_email,
            'password': self.instructor_password
        }, name="/api/auth/login (Instructor)")

        if response.status_code == 200:
            self.token = response.json().get('access_token')
            self.headers = {'Authorization': f'Bearer {self.token}'}

    @task(2)
    def view_classrooms(self):
        if not self.token: return
        with self.client.get('/api/classrooms/', headers=self.headers, name='/api/classrooms/ (Instructor)', catch_response=True) as response:
             if response.status_code not in [200, 201]:
                 response.failure(f"View class failed: {response.text}")

    @task(1)
    def trigger_analysis(self):
        if not self.token: return
        
        # This is the heavy AST/TF-IDF scan!
        with self.client.post(
            f'/api/analyze/{self.assignment_id}', 
            headers=self.headers, 
            name='/api/analyze/... (AST Plagiarism Scan)',
            catch_response=True
        ) as response:
            if response.status_code not in [200, 201]:
                response.failure(f"Analysis failed: {response.text}")
