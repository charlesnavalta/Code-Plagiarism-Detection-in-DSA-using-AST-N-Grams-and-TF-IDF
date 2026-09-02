# Structural Source Code Plagiarism Detection Using AST N-Grams and TF-IDF

> **Research Title:** Structural Source Code Plagiarism Detection Using AST N-Grams and TF-IDF  
> **Institution:** Pamantasan ng Cabuyao (University of Cabuyao) — Planning, Research, and Extension Division  
> **Lead Researcher:** De Lara, Dan Carlo B.  
> **Members:** Mangune, Duncan Mcneil R., Paller, Nicolo Mouri, Navalta, Charles Darwin  
> **System Name:** Falsicode Plagiarism Detection System  

---

## Table of Contents
1. [System Architecture & Modularity](#1-system-architecture--modularity)
2. [Underlying Detection Algorithms & Methodology](#2-underlying-detection-algorithms--methodology)
3. [Robust Exception Handling & Server Stability](#3-robust-exception-handling--server-stability)
4. [Standalone & Local Operation (Zero Third-Party APIs)](#4-standalone--local-operation-zero-third-party-apis)
5. [Cross-Browser Compatibility](#5-cross-browser-compatibility)
6. [Laboratory Transfer & Virtual Environment Setup Guide](#6-laboratory-transfer--virtual-environment-setup-guide)
7. [Default Seeded Evaluation Accounts](#7-default-seeded-evaluation-accounts)
8. [Automated Benchmark Evaluation Script](#8-automated-benchmark-evaluation-script)

---

## 1. System Architecture & Modularity

The system implements a **strictly decoupled, modular client-server architecture**. Frontend user interface concerns are completely isolated from backend computational and Abstract Syntax Tree (AST) parsing modules.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (React 18)                      │
│   - Student Submissions UI         - Classroom & Assignment Manager    │
│   - Plagiarism Analysis Report     - Interactive Token / Line Diff     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST API (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND CONTROLLER (Flask 3.x)                     │
│   - routes/auth.py                 - routes/classrooms.py              │
│   - routes/submissions.py          - routes/analysis.py                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Direct Module Invocation
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     CORE AST & PLAGIARISM ENGINES                      │
│  ┌────────────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │    python_engine.py    │  │ java_engine.py │  │  similarity.py   │  │
│  │ - ast.NodeVisitor      │  │ - javalang     │  │ - N-Gram Window  │  │
│  │ - Dead-code reachability│ │ - Token mapping│  │ - TF-IDF Matrix  │  │
│  │ - AST token extraction │  │ - Dead-code    │  │ - Dual Scoring   │  │
│  └────────────────────────┘  └────────────────┘  │ - Type 1/2/3 Diff│  │
│                                                  └──────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Codebase Organization
* **`client/`**: Standalone Single Page Application (SPA) built with React 18, utilizing Axios for API communication and standard HTML5/CSS for cross-browser rendering.
* **`server/routes/`**: API controller layer managing HTTP request parsing, JWT security, and response formatting without embedding domain AST algorithms.
* **`server/utils/`**: Dedicated algorithmic and parsing engines:
  * [`server/utils/python_engine.py`](server/utils/python_engine.py): Pure Python AST token visitor (`ASTTokenExtractor`) and dead-code reachability pruner (`find_dead_nodes_python`).
  * [`server/utils/java_engine.py`](server/utils/java_engine.py): Java AST parser using `javalang` with cross-language AST token normalization and dead-code removal.
  * [`server/utils/similarity.py`](server/utils/similarity.py): Mathematical vectorization and comparison engine implementing TF-IDF, N-Gram sliding windows, Cosine Similarity, Containment metrics, and Type 1/2/3 taxonomy classification.
* **`server/models.py` & `server/database.py`**: Relational ORM models (SQLAlchemy) mapping users, classrooms, assignments, enrollments, and submissions.

---

## 2. Underlying Detection Algorithms & Methodology

The detection engine uses a 5-phase deterministic pipeline designed to capture structural similarities in Data Structures and Algorithms (DSA) source code:

1. **AST Parsing & Dead-Code Reachability Pruning:**
   * Both Python (`ast`) and Java (`javalang`) AST trees undergo iterative reachability analysis (`find_dead_nodes_python` / `find_dead_nodes_java`) to eliminate uncalled decoy functions and dead variable declarations injected to evade detection.
2. **Structural Token Normalization:**
   * Nodes are transformed into standardized semantic tokens (e.g., `FunctionDef_FUNC`, `Name_ID`, `Constant_CONST`, `For`, `While`, `Call_CALL`). This neutralizes simple identifier renaming and formatting alterations.
3. **N-Gram Sliding Window Generation:**
   * A sliding window extracts token N-grams (bi-grams to 5-grams). Dynamic N-gram bounds are tuned per language (`(2, 4)` for concise Python ASTs, `(3, 5)` for dense Java ASTs).
4. **TF-IDF Vectorization with Sublinear Term Frequency:**
   * Tokens are weighted using `TfidfVectorizer(sublinear_tf=True)`. High-frequency DSA boilerplate is dampened using dynamic document frequency thresholds (`max_df`).
5. **Dual Scoring (Cosine Similarity & Containment Skeleton Metric):**
   * Cosine Similarity measures overall overlap:
     $$\text{Cosine}(\vec{u}, \vec{v}) = \frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}$$
   * The **Containment Skeleton Metric** catches asymmetric plagiarism where a small solution is embedded inside a large file:
     $$\text{Containment}(A, B) = \frac{\sum \min(w_{A, k}, w_{B, k})}{\min(\sum w_A, \sum w_B)} \times 100\%$$
   * Final Score: $\max(\text{Cosine}, \text{Containment})$.
6. **Multi-Class Plagiarism Taxonomy (Type 1, Type 2, Type 3):**
   * **Type 1 (Verbatim Copy):** Evaluated via raw identifier/literal identity signatures across matched line intervals (`RAW_IDENTITY_TYPE1_THRESHOLD = 75%`).
   * **Type 2 (Renamed Identifiers):** Normalized AST matches with modified identifier names.
   * **Type 3 (Reordered / Structurally Modified):** Detected via relative N-Gram sequence ordering (`difflib.SequenceMatcher`) and multiset structural divergence of control-flow node types (`structural_divergence`).

---

## 3. Robust Exception Handling & Server Stability

The backend incorporates multi-tiered fault tolerance to ensure backend server stability at all times:

1. **Upload-Time AST Syntax Validation ([`server/routes/submissions.py`](server/routes/submissions.py)):**
   * Every submitted code file is parsed immediately via `ast.parse()` or `javalang.parse.parse()`.
   * Files containing syntax errors are rejected with HTTP 400 and an informative error response pinpointing the exact line number, preventing corrupt files from ever being stored.
2. **Batch Analysis Isolation ([`server/routes/analysis.py`](server/routes/analysis.py)):**
   * During batch analysis, each file is parsed inside an isolated `try...except` block. If an individual file fails due to an unexpected encoding or parsing issue, it is skipped and logged, allowing the remaining student cohort to be analyzed without halting the engine.
3. **Global Server Error Interceptor ([`server/app.py`](server/app.py)):**
   * A global `@app.errorhandler(Exception)` decorator catches unhandled runtime exceptions, logs full stack traces for debugging, guarantees proper CORS headers are attached, and returns clean JSON error payloads. The backend server never crashes or hangs.

---

## 4. Standalone & Local Operation (Zero Third-Party APIs)

* **100% Local Processing:** Unlike Stanford MOSS—which requires transmitting proprietary student source code to external servers over network sockets—Falsicode performs all AST generation, tokenization, and vectorization locally on the host machine.
* **No Cloud API Dependencies:** No third-party AI APIs (e.g., OpenAI, Gemini), commercial plagiarism APIs, or cloud vector databases are required.
* **Offline Ready:** With pre-seeded instructor/student accounts, the full system can be run and demonstrated in an isolated computer laboratory without internet access.

---

## 5. Cross-Browser Compatibility

The client application is tested and fully compatible across all major modern web browsers:
* **Google Chrome** (v90+)
* **Mozilla Firefox** (v88+)
* **Microsoft Edge** (v90+)
* **Apple Safari** (v14+)

Built with standard React 18, standard ECMAScript transpilation (`browserslist: >0.2%, not dead`), and standard CSS3 Flexbox/Grid layouts without vendor-specific proprietary extensions.

---

## 6. Laboratory Transfer & Virtual Environment Setup Guide

You can deploy the complete system to any academic laboratory computer or personal workstation using either **Docker** (Option A) or a **Standard Python Virtual Environment** (Option B).

### Option A: 1-Click Setup with Docker (Recommended for Lab PCs)
Ensure [Docker Desktop](https://www.docker.com/products/docker-desktop/) is installed.

1. **Clone or Copy Repository:**
   ```bash
   git clone https://github.com/charlesnavalta/Code-Plagiarism-Detection-in-DSA-using-AST-N-Grams-and-TF-IDF.git
   cd Code-Plagiarism-Detection-in-DSA-using-AST-N-Grams-and-TF-IDF
   ```
2. **Create Environment File:**
   ```bash
   cp .env.example .env
   ```
3. **Build & Start Containers:**
   ```bash
   docker-compose up --build
   ```
4. **Access the System:**
   * **Frontend Application:** `http://localhost:3000`
   * **Backend API:** `http://localhost:5000`
   * **phpMyAdmin (Database Management):** `http://localhost:8080`

---

### Option B: Manual Local Setup (Python Virtual Environment + Node.js)

#### 1. Backend Setup (Flask API)
**Prerequisites:** Python 3.9+ and MySQL Server (or XAMPP/MariaDB).

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Create and activate a Python virtual environment:
   * **Windows (Command Prompt / PowerShell):**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   * **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   * Copy `.env.example` to `.env` in the `server` directory and configure your MySQL database credentials:
     ```ini
     DB_HOST=localhost
     DB_PORT=3306
     DB_DATABASE=system_db
     DB_USERNAME=root
     DB_PASSWORD=your_mysql_password
     ```
5. Seed the database with evaluation data:
   ```bash
   flask seed
   ```
6. Start the Flask backend:
   ```bash
   python app.py
   ```
   *The backend will be available at `http://localhost:5000`.*

#### 2. Frontend Setup (React Application)
**Prerequisites:** Node.js 18+ and npm.

1. In a new terminal, navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The web client will open automatically at `http://localhost:3000`.*

---

## 7. Default Seeded Evaluation Accounts

When initialized with `flask seed` (or Docker `AUTO_SEED=true`), the system includes pre-verified accounts for immediate evaluation:

| Role | Email | Password | Pre-Configured Classrooms |
| :--- | :--- | :--- | :--- |
| **Instructor** | `renz@gmail.com` | `renz123` | CS201 - Data Structures & Algorithms |
| **Instructor** | `ba@gmail.com` | `ba123` | CS301 - Advanced Algorithms |
| **Student** | `mary@gmail.com` | `mary123` | Enrolled in CS201 & CS301 |
| **Student** | `charles@gmail.com` | `charles123` | Enrolled in CS201 & CS301 |
| **Student** | `nicolo@gmail.com` | `nicolo123` | Enrolled in CS201 & CS301 |
| **Administrator** | `admin@test.com` | `admin123` | Full Administrative Rights |

---

## 8. Automated Benchmark Evaluation Script

The repository includes a standalone statistical benchmark script to verify binary accuracy and multi-class plagiarism classification against labeled DSA datasets:

```bash
cd server
python evaluate_metrics.py
```

This runs offline against ground-truth datasets for Python and Java, generating statistical accuracy, precision, recall, and F1-scores without requiring database connections or network access.