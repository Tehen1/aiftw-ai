import pytest
from fastapi_poe.types import ProtocolMessage
from fastapi_poe.client import QueryRequest
from ..poe_bot import AIFTWBot

@pytest.fixture
def bot():
    return AIFTWBot()

@pytest.mark.asyncio
async def test_get_settings(bot):
    settings = await bot.get_settings()
    assert settings.name == "AIFTW Bot"
    assert settings.suggested_replies is True
    assert settings.allow_attachments is True
    assert settings.allow_files is True

@pytest.mark.asyncio
async def test_get_response(bot):
    # Create a mock request
    request = QueryRequest(
        query=[
            ProtocolMessage(role="user", content="Hello!", attachments=[])
        ],
        conversation_id="test_conv_1"
    )

    # Get response
    responses = [r async for r in bot.get_response(request)]
    assert len(responses) == 1
    
    response = responses[0]
    assert "Hello" in response.text
    assert len(response.suggested_replies) == 3

@pytest.mark.asyncio
async def test_conversation_context(bot):
    # First message
    request1 = QueryRequest(
        query=[
            ProtocolMessage(role="user", content="What is AI?", attachments=[])
        ],
        conversation_id="test_conv_2"
    )
    responses1 = [r async for r in bot.get_response(request1)]

    # Second message in same conversation
    request2 = QueryRequest(
        query=[
            ProtocolMessage(role="user", content="Tell me more", attachments=[])
        ],
        conversation_id="test_conv_2"
    )
    responses2 = [r async for r in bot.get_response(request2)]

    # Check if context is maintained
    assert "test_conv_2" in bot.conversation_history
    assert len(bot.conversation_history["test_conv_2"]) == 4  # 2 user + 2 bot messages

@pytest.mark.asyncio
async def test_error_handling(bot):
    # Create an invalid request to test error handling
    request = QueryRequest(
        query=[],  # Empty query should trigger error handling
        conversation_id="test_conv_3"
    )

    responses = [r async for r in bot.get_response(request)]
    assert len(responses) == 1
    assert "error" in responses[0].text.lower()

@pytest.mark.asyncio
async def test_suggested_replies(bot):
    request = QueryRequest(
        query=[
            ProtocolMessage(role="user", content="Hello", attachments=[])
        ],
        conversation_id="test_conv_4"
    )

    responses = [r async for r in bot.get_response(request)]
    assert len(responses) == 1
    assert len(responses[0].suggested_replies) == 3
    assert all(isinstance(reply, str) for reply in responses[0].suggested_replies)
