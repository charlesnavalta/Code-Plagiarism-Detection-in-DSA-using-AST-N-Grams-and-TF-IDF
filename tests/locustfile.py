import os
import sys
import random
from locust import HttpUser, task, between, events

class StudentBehavior(HttpUser):
    wait_time = between(1, 2)
    
    def on_start(self):
        print("ON_START EXECUTING", file=sys.stderr)
        self.token = None
        self.class_id = os.environ.get('TEST_CLASS_ID', '1')
        self.assignment_id = os.environ.get('TEST_ASSIGNMENT_ID', '1')
        self.student_email = os.environ.get('TEST_STUDENT_EMAIL', 'test1@example.com')
        self.student_password = os.environ.get('TEST_STUDENT_PASSWORD', 'password123')

        try:
            response = self.client.post('/api/auth/login', json={
                'email': self.student_email,
                'password': self.student_password
            })
            print(f"LOGIN RESPONSE: {response.status_code}", file=sys.stderr)
            if response.status_code == 200:
                self.token = response.json().get('access_token')
                self.headers = {'Authorization': f'Bearer {self.token}'}
            else:
                print(f"LOGIN FAILED: {response.text}", file=sys.stderr)
        except Exception as e:
            print(f"Exception in on_start: {e}", file=sys.stderr)

    @task(3)
    def submit_code(self):
        print("SUBMIT_CODE EXECUTING", file=sys.stderr)
        if not self.token:
            return
            
        file_path = os.path.join(os.path.dirname(__file__), 'sample_submission.py')
        try:
            with open(file_path, 'rb') as f:
                files = {'file': ('sample_submission.py', f, 'text/x-python')}
                with self.client.post(
                    f'/api/classrooms/{self.class_id}/assignments/{self.assignment_id}/submit', 
                    headers=self.headers,
                    files=files,
                    name='/api/.../submit',
                    catch_response=True
                ) as response:
                    print(f"SUBMIT RESPONSE: {response.status_code}", file=sys.stderr)
                    if response.status_code not in [200, 201]:
                        response.failure(f"Submit failed: {response.text}")
        except FileNotFoundError:
            print("FILE NOT FOUND", file=sys.stderr)

    @task(1)
    def view_assignments(self):
        print("VIEW_ASSIGNMENTS EXECUTING", file=sys.stderr)
        if not self.token:
            return
            
        with self.client.get(
            f'/api/classrooms/{self.class_id}/assignments',
            headers=self.headers,
            name='/api/.../assignments',
            catch_response=True
        ) as response:
            print(f"VIEW RESPONSE: {response.status_code}", file=sys.stderr)
            if response.status_code not in [200, 201]:
                response.failure(f"View failed: {response.text}")
