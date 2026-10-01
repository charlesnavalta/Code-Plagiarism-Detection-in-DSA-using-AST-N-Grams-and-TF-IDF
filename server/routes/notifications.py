"""
=============================================================================
FALSICODE: User Notifications Blueprint
=============================================================================
Provides REST endpoints for fetching, reading, dismissing, and clearing
in-app notifications for both students and instructors.
=============================================================================
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Notification, User

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_user_notifications():
    """Fetches recent notifications for the logged-in user with total unread count"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        notifications = Notification.query.filter_by(
            user_id=user.id
        ).order_by(Notification.created_at.desc()).limit(50).all()

        unread_count = Notification.query.filter_by(
            user_id=user.id,
            is_read=False
        ).count()

        return jsonify({
            "notifications": [n.to_dict() for n in notifications],
            "unread_count": unread_count
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch notifications: {str(e)}"}), 500


@notifications_bp.route('/<int:notification_id>/read', methods=['PATCH'])
@jwt_required()
def mark_notification_read(notification_id):
    """Marks a single notification as read"""
    try:
        current_user_id = get_jwt_identity()
        notif = Notification.query.filter_by(id=notification_id, user_id=current_user_id).first()
        if not notif:
            return jsonify({"error": "Notification not found"}), 404

        notif.is_read = True
        db.session.commit()

        unread_count = Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).count()

        return jsonify({
            "message": "Notification marked as read",
            "notification": notif.to_dict(),
            "unread_count": unread_count
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update notification: {str(e)}"}), 500


@notifications_bp.route('/read-all', methods=['PATCH'])
@jwt_required()
def mark_all_read():
    """Marks all unread notifications as read for current user"""
    try:
        current_user_id = get_jwt_identity()
        Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).update({"is_read": True})
        db.session.commit()

        return jsonify({
            "message": "All notifications marked as read",
            "unread_count": 0
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to mark all read: {str(e)}"}), 500


@notifications_bp.route('/<int:notification_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notification_id):
    """Deletes a specific notification"""
    try:
        current_user_id = get_jwt_identity()
        notif = Notification.query.filter_by(id=notification_id, user_id=current_user_id).first()
        if not notif:
            return jsonify({"error": "Notification not found"}), 404

        db.session.delete(notif)
        db.session.commit()

        unread_count = Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).count()

        return jsonify({
            "message": "Notification deleted",
            "unread_count": unread_count
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete notification: {str(e)}"}), 500


@notifications_bp.route('/clear-all', methods=['DELETE'])
@jwt_required()
def clear_all_notifications():
    """Clears all notifications for current user"""
    try:
        current_user_id = get_jwt_identity()
        Notification.query.filter_by(user_id=current_user_id).delete()
        db.session.commit()

        return jsonify({
            "message": "All notifications cleared",
            "unread_count": 0
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to clear notifications: {str(e)}"}), 500
