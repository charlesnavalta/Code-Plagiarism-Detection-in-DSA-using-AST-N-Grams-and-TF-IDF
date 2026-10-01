"""
=============================================================================
FALSICODE: Notification Dispatch Helper
=============================================================================
Utility functions for generating in-app notification alerts for instructors
and students across assignment creation, submissions, reviews, and audits.
=============================================================================
"""

from database import db
from models import Notification

def create_notification(user_id, title, message, type='system', link=None):
    """
    Creates and persists a single user notification.
    Safely catches exceptions so main workflow is never blocked.
    """
    if not user_id:
        return None
    try:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=type,
            link=link
        )
        db.session.add(notif)
        db.session.commit()
        return notif
    except Exception as e:
        db.session.rollback()
        print(f"Falsicode Notification Warning: Failed to create notification for user {user_id}: {e}")
        return None

def create_bulk_notifications(user_ids, title, message, type='system', link=None):
    """
    Creates and persists notifications for multiple recipients in a single transaction.
    """
    if not user_ids:
        return []
    try:
        unique_uids = list(set(user_ids))
        notifs = [
            Notification(
                user_id=uid,
                title=title,
                message=message,
                type=type,
                link=link
            )
            for uid in unique_uids
        ]
        db.session.add_all(notifs)
        db.session.commit()
        return notifs
    except Exception as e:
        db.session.rollback()
        print(f"Falsicode Notification Warning: Failed to create bulk notifications: {e}")
        return []
