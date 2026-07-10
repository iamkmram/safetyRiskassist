class ConversationService:
    """
    Service layer for conversation operations.
    Stub implementation  replace with real data store interactions.
    """

    def __init__(self):
        # In-memory store for demo purposes
        self._conversations = {}

    def get_conversation(self, conversation_id: str):
        return self._conversations.get(conversation_id)

    def create_conversation(self, conversation_id: str, title: str = ""):
        from backend.functions.chat.conversations.index import Conversation
        conv = Conversation(conversation_id, title)
        self._conversations[conversation_id] = conv
        return conv

    def add_message(self, conversation_id: str, message):
        conv = self.get_conversation(conversation_id)
        if conv:
            conv.add_message(message)
        else:
            raise ValueError(f"Conversation {conversation_id} not found")
