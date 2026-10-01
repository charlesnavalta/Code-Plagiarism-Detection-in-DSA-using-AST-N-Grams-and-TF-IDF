"""
=============================================================================
FALSICODE: Multi-Language AST Parsing & Tokenization Registry
=============================================================================
Central registry for programming language parsers.
Adding support for a new language (e.g. C++, JavaScript, C#):
1. Create `<language>_engine.py` in this directory implementing `process_<language>_file(content)`.
2. Register the engine configuration in `LANGUAGE_REGISTRY`.
=============================================================================
"""

import os
from .python_engine import process_python_file, find_dead_nodes_python, ASTTokenExtractor
from .java_engine import process_java_file, find_dead_nodes_java

# Central registry defining supported languages, file extensions, and tuned N-Gram bounds
LANGUAGE_REGISTRY = {
    'python': {
        'name': 'Python',
        'process': process_python_file,
        'ngram_bounds': (3, 5),
        'extensions': ['.py']
    },
    'java': {
        'name': 'Java',
        'process': process_java_file,
        'ngram_bounds': (3, 5),
        'extensions': ['.java']
    }
}

# Reverse lookup mapping from file extension to language key (e.g. '.py' -> 'python')
EXTENSION_MAP = {}
for lang_key, config in LANGUAGE_REGISTRY.items():
    for ext in config['extensions']:
        EXTENSION_MAP[ext.lower()] = lang_key


def get_language_engine(lang_or_ext: str):
    """
    Retrieves the language configuration and processing function by language name
    or file extension.

    Args:
        lang_or_ext (str): Language identifier ('python', 'java') or extension ('.py', '.java', 'file.py').

    Returns:
        dict: Engine configuration containing 'name', 'process', 'ngram_bounds', 'extensions'.
              Defaults to Python engine if language is unknown.
    """
    if not lang_or_ext:
        return LANGUAGE_REGISTRY['python']

    identifier = str(lang_or_ext).lower().strip()

    # Direct match by language name (e.g. 'python', 'java')
    if identifier in LANGUAGE_REGISTRY:
        return LANGUAGE_REGISTRY[identifier]

    # Direct match by file extension (e.g. '.py', '.java')
    if identifier in EXTENSION_MAP:
        return LANGUAGE_REGISTRY[EXTENSION_MAP[identifier]]

    # Extract extension if full path or filename was provided (e.g. 'Solution.java')
    _, ext = os.path.splitext(identifier)
    if ext and ext in EXTENSION_MAP:
        return LANGUAGE_REGISTRY[EXTENSION_MAP[ext]]

    # Default fallback
    return LANGUAGE_REGISTRY['python']


def is_language_supported(lang_or_ext: str) -> bool:
    """Checks whether a language or file extension is supported."""
    if not lang_or_ext:
        return False
    identifier = str(lang_or_ext).lower().strip()
    if identifier in LANGUAGE_REGISTRY or identifier in EXTENSION_MAP:
        return True
    _, ext = os.path.splitext(identifier)
    return ext in EXTENSION_MAP


def get_supported_languages() -> list[str]:
    """Returns a list of all registered language identifiers."""
    return list(LANGUAGE_REGISTRY.keys())


def get_supported_extensions() -> list[str]:
    """Returns a list of all supported file extensions."""
    return list(EXTENSION_MAP.keys())


__all__ = [
    'LANGUAGE_REGISTRY',
    'get_language_engine',
    'is_language_supported',
    'get_supported_languages',
    'get_supported_extensions',
    'process_python_file',
    'find_dead_nodes_python',
    'ASTTokenExtractor',
    'process_java_file',
    'find_dead_nodes_java'
]
