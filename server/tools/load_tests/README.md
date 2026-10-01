# Stress & Load Testing Guide

This directory contains Locust load testing scripts to evaluate the backend REST API concurrency, throughput, and AST analysis stability.

## Prerequisites

```bash
pip install locust
```

## Running the Stress Test against the Server

1. Open your terminal in the root of the project (or inside `server/`).
2. Run the Locust command, specifying the **deployed API URL** or local host:

```bash
locust -f server/tools/load_tests/locustfile.py --host=http://localhost:5000
```
*(Replace the URL with your actual deployed backend URL if testing against staging/production)*

### Setting Environment Variables (Optional)
If you want to customize the test (like changing the test classroom ID or student credentials), you can pass environment variables when starting locust:

**Windows (PowerShell):**
```powershell
$env:TEST_STUDENT_EMAIL="student1@example.com"
$env:TEST_CLASS_ID="1"
$env:TEST_ASSIGNMENT_ID="1"
locust -f server/tools/load_tests/locustfile.py --host=http://localhost:5000
```

**Linux / macOS (Bash):**
```bash
TEST_STUDENT_EMAIL="student1@example.com" TEST_CLASS_ID="1" TEST_ASSIGNMENT_ID="1" locust -f server/tools/load_tests/locustfile.py --host=http://localhost:5000
```

## Using the Web Dashboard
After running the command, Locust will start a local web server for the dashboard.
1. Open your browser and navigate to `http://localhost:8089`
2. Enter the number of concurrent users (e.g., 50).
3. Enter the spawn rate (e.g., 5 users per second).
4. Click **Start Swarming**.
5. View live performance charts, response time percentiles, and failure rates.
