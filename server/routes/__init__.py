"""
=============================================================================
FALSICODE: API Routing Package
=============================================================================
Consolidates and re-exports all Flask Blueprints for clean, centralized
importing in app.py.
=============================================================================
"""

from .analysis import analysis_bp
from .auth import auth_bp
from .classrooms import classrooms_bp
from .assignments import assignments_bp
from .submissions import submissions_bp
from .admin import admin_bp

__all__ = [
    'analysis_bp',
    'auth_bp',
    'classrooms_bp',
    'assignments_bp',
    'submissions_bp',
    'admin_bp'
]
