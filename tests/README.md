# Stress Testing Guide

This directory contains the Locust load testing script to test your API concurrency.

## Prerequisites
\\\ash
pip install locust
\\\

## Running the Stress Test against the Deployed Server

1. Open your terminal in the root of the project.
2. Run the Locust command, specifying the **deployed API URL** as the host.

\\\ash
locust -f tests/locustfile.py --host=https://YOUR-DEPLOYED-BACKEND.onrender.com
\\\
*(Replace the URL with your actual deployed backend URL)*

### Setting Environment Variables (Optional)
If you want to customize the test (like changing the test classroom ID or student credentials), you can pass environment variables when starting locust:

**Windows (PowerShell):**
\\\powershell
$env:TEST_STUDENT_EMAIL="student1@example.com"
$env:TEST_CLASS_ID="1"
$env:TEST_ASSIGNMENT_ID="1"
locust -f tests/locustfile.py --host=https://YOUR-DEPLOYED-BACKEND.onrender.com
\\\

## Using the Web Dashboard
After running the command, Locust will start a local web server for the dashboard.
1. Open your browser and go to http://localhost:8089
2. Enter the number of concurrent students (e.g., 50).
3. Enter the spawn rate (e.g., 5 students per second).
4. Click **Start Swarming**.
5. You can view the live charts, response times, and failure rates to use for your questionnaire/thesis!
