"""
=============================================================================
FALSICODE: Application Utility Services Package
=============================================================================
General system helpers: email verification (OTP), upload file management,
and user notifications.
=============================================================================
"""

from .email_service import generate_6_digit_code, send_otp_email
from .file_manager import cleanup_assignment_files, cleanup_classroom_files, scan_and_clean_orphaned_uploads
from .notification_helper import create_notification, create_bulk_notifications

__all__ = [
    'generate_6_digit_code',
    'send_otp_email',
    'cleanup_assignment_files',
    'cleanup_classroom_files',
    'scan_and_clean_orphaned_uploads',
    'create_notification',
    'create_bulk_notifications'
]
