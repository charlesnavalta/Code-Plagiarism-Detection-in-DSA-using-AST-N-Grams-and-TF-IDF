"""
=============================================================================
FALSICODE: Seeder Entry Point (Backward Compatibility Proxy)
=============================================================================
Re-exports run_smart_seed from the modular seeders package.
=============================================================================
"""

from seeders import run_smart_seed

__all__ = ['run_smart_seed']