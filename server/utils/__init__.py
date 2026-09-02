"""
=============================================================================
FALSICODE: Utilities & Core Algorithmic Engines Package
=============================================================================
Centralizes exports for AST parsing, token extraction, similarity vectorization,
and notification services.
=============================================================================
"""

from .python_engine import process_python_file, find_dead_nodes_python, ASTTokenExtractor
from .java_engine import process_java_file, find_dead_nodes_java
from .similarity import (
    compare_all_files,
    classify_plagiarism_type,
    structural_divergence,
    get_structural_skeleton,
    get_raw_identity_signature,
    get_ordered_shared_sequence
)
from .email_service import generate_6_digit_code, send_otp_email

__all__ = [
    'process_python_file',
    'find_dead_nodes_python',
    'ASTTokenExtractor',
    'process_java_file',
    'find_dead_nodes_java',
    'compare_all_files',
    'classify_plagiarism_type',
    'structural_divergence',
    'get_structural_skeleton',
    'get_raw_identity_signature',
    'get_ordered_shared_sequence',
    'generate_6_digit_code',
    'send_otp_email'
]
