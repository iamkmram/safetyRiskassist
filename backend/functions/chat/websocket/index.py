import asyncio
import json
from typing import AsyncGenerator

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session

from backend.shared.middleware.auth import get_current_user, verify_jwt_token  # adjust if needed
from backend.shared.services.ConversationService import ConversationService
from backend.shared.models.Message import Message

router = APIRouter(prefix="/ws/chat", tags=["websocket"])

async def dummy_ai_generator(prompt: str) -> AsyncGenerator[str, None]:
    """
    Stub async generator that yields dummy AI response chunks.
    """
    for chunk in [
        "Processing your request...",
        "Here is a simulated answer based on the prompt.",
    ]:
        await asyncio.sleep(0.5)
        yield chunk

@router.websocket("/{conversation_id}")
async def chat_websocket(
    websocket: WebSocket,
    conversation_id: int,
    token: str = None,
):
    """
    WebSocket endpoint for streaming AI responses.
    Expected query param: token=<jwt>
    """
    await websocket.accept()
    # Simple token extraction from query parameters if not provided explicitly
    if token is None:
        token = websocket.query_params.get("token")
    if not token:
        await websocket.send_json(
            {"error": "authentication_error", "detail": "Missing token", "code": 401}
        )
        await websocket.close()
        return

    # Validate JWT - reuse existing logic
    try:
        payload = verify_jwt_token(token)  # returns dict with at least 'sub' (user id)
        user_id = int(payload.get("sub"))
    except HTTPException as exc:
        await websocket.send_json(
            {"error": "authentication_error", "detail": exc.detail, "code": exc.status_code}
        )
        await websocket.close()
        return

    # Get DB session (using the same dependency pattern as REST)
    # The get_db dependency is a generator; we manually retrieve a session here.
    from backend.shared.middleware.auth import get_db  # assuming get_db defined in same module

    db_gen = get_db()
    db = next(db_gen)

    service = ConversationService(db)

    try:
        # Verify the conversation belongs to the user
        service.get_conversation(user_id, conversation_id)

        while True:
            try:
                data = await websocket.receive_text()
                payload = json.loads(data)
                role = payload.get("role")
                content = payload.get("content")
                if role not in ("user", "assistant") or not content:
                    await websocket.send_json(
                        {
                            "error": "validation_error",
                            "detail": "Invalid message format",
                            "code": 400,
                        }
                    )
                    continue

                # Persist inbound user message
                inbound_msg = service.add_message(
                    user_id,
                    conversation_id,
                    {"role": role, "content": content},
                )
                await websocket.send_json(
                    {
                        "id": inbound_msg.id,
                        "role": inbound_msg.role,
                        "content": inbound_msg.content,
                        "created_at": inbound_msg.created_at.isoformat(),
                    }
                )

                # Simulate AI response streaming
                async for chunk in dummy_ai_generator(content):
                    # Persist outbound assistant message (once per chunk or once after full response)
                    # For simplicity we create a single assistant message after the loop.
                    await websocket.send_text(chunk)

                # After streaming, store a single assistant message
                assistant_msg = service.add_message(
                    user_id,
                    conversation_id,
                    {"role": "assistant", "content": "Simulated AI response"},
                )
                await websocket.send_json(
                    {
                        "id": assistant_msg.id,
                        "role": assistant_msg.role,
                        "content": assistant_msg.content,
                        "created_at": assistant_msg.created_at.isoformat(),
                    }
                )

            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                await websocket.send_json(
                    {
                        "error": "validation_error",
                        "detail": "Invalid JSON payload",
                        "code": 400,
                    }
                )
            except Exception as exc:
                await websocket.send_json(
                    {
                        "error": "internal_error",
                        "detail": str(exc),
                        "code": 500,
                    }
                )
                break
    finally:
        # Clean up DB session
        db.close()
        await websocket.close()
