"""Central notification service used by the backend."""


class NotificationService:
    """Service responsible for sending notifications."""

    def __init__(self):
        pass

    def send(self, user_id, title, body, channel=None):
        """Send a notification to a user."""
        # Placeholder implementation  in real code this would call email,
        # push, Teams, etc.
        return {
            "user_id": user_id,
            "title": title,
            "body": body,
            "channel": channel or "default",
            "status": "sent",
        }

