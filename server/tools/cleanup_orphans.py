"""
=============================================================================
FALSICODE: Orphan Uploads Cleanup CLI Tool
=============================================================================
Scans the server/uploads/ folder and compares all files against active
Submission and AssignmentAttachment database records.
Safely removes abandoned/orphaned files that no longer exist in the database.

Usage:
    # Dry run (preview only, no files deleted):
    python server/cleanup_orphans.py

    # Apply cleanup (permanently delete unreferenced files):
    python server/cleanup_orphans.py --apply
=============================================================================
"""

import sys
import os
import argparse

# Point BASE_DIR to server/ (parent directory of tools/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

def main():
    parser = argparse.ArgumentParser(description="Scan and clean orphaned files in server/uploads/")
    parser.add_argument("--apply", action="store_true", help="Apply deletion of orphaned files (default is dry-run)")
    args = parser.parse_args()

    from app import create_app
    from utils.file_manager import scan_and_clean_orphaned_uploads

    app = create_app()
    with app.app_context():
        dry_run = not args.apply
        mode_str = "[DRY RUN - PREVIEW ONLY]" if dry_run else "[APPLY MODE - DELETING]"
        print(f"\n=======================================================")
        print(f" FALSICODE: Upload Storage Audit & Cleanup {mode_str}")
        print(f"=======================================================\n")

        result = scan_and_clean_orphaned_uploads(dry_run=dry_run)
        if "error" in result:
            print(f"[!] Notice: Database query failed ({result['error']}).")
            print("    Ensure your MySQL database server is running (e.g., net start MySQL80 or Docker).\n")
            return

        orphans = result.get("orphans", [])

        if not orphans:
            print("✓ Storage is clean! No orphaned files found in server/uploads/.\n")
            return

        print(f"Found {len(orphans)} orphaned file(s) in server/uploads/:")
        for i, f in enumerate(orphans, 1):
            status = "Pending deletion" if dry_run else "Deleted"
            print(f"  {i}. {f} [{status}]")

        if dry_run:
            print("\nNotice: No files were deleted. To permanently delete these files, run:")
            print("    python cleanup_orphans.py --apply\n")
        else:
            print(f"\n✓ Successfully removed {result.get('deleted', 0)} orphaned file(s) from disk.\n")


if __name__ == "__main__":
    main()
