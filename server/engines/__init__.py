"""
=============================================================================
FALSICODE: Core Code Analysis & Plagiarism Detection Engines
=============================================================================
Central package for AST language parsers, structural tokenizers,
TF-IDF vectorization, containment metrics, and multi-class plagiarism classifiers.
=============================================================================
"""

from .languages import (
    get_language_engine,
    is_language_supported,
    get_supported_languages,
    get_supported_extensions,
    process_python_file,
    process_java_file
)
from .detection import (
    compare_all_files,
    classify_plagiarism_type,
    structural_divergence,
    get_structural_skeleton,
    get_raw_identity_signature,
    get_ordered_shared_sequence,
    detect_renamed_line_pairs,
    ORDER_SIMILARITY_THRESHOLD,
    RAW_IDENTITY_TYPE1_THRESHOLD,
    STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD
)

__all__ = [
    'get_language_engine',
    'is_language_supported',
    'get_supported_languages',
    'get_supported_extensions',
    'process_python_file',
    'process_java_file',
    'compare_all_files',
    'classify_plagiarism_type',
    'structural_divergence',
    'get_structural_skeleton',
    'get_raw_identity_signature',
    'get_ordered_shared_sequence',
    'detect_renamed_line_pairs',
    'ORDER_SIMILARITY_THRESHOLD',
    'RAW_IDENTITY_TYPE1_THRESHOLD',
    'STRUCTURAL_DIVERGENCE_TYPE3_THRESHOLD'
]
