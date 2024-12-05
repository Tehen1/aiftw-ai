from typing import AsyncGenerator, List, Optional
import fastapi_poe as fp
import os
from dotenv import load_dotenv
import json
import aiohttp
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

class AIFTWBot(fp.PoeBot):
    def __init__(self):
        self.conversation_history = {}
        self.message_count = {}
        self.last_context_refresh = {}

    async def get_response(
        self, request: fp.QueryRequest
    ) -> AsyncGenerator[fp.PartialResponse, None]:
        """Reply to a message in the conversation with enhanced capabilities."""
        try:
            # Log incoming request
            logger.info(f"Received request from conversation {request.conversation_id}")

            # Get the current message
            current_message = request.query[-1].content
            
            # Update conversation history
            if request.conversation_id not in self.conversation_history:
                self.conversation_history[request.conversation_id] = []
                self.message_count[request.conversation_id] = 0
            
            self.conversation_history[request.conversation_id].append({
                'role': 'user',
                'content': current_message,
                'timestamp': datetime.now().isoformat()
            })
            
            self.message_count[request.conversation_id] += 1

            # Process attachments if any
            attachments = []
            if request.query[-1].attachments:
                for attachment in request.query[-1].attachments:
                    attachments.append({
                        'type': attachment.file_type,
                        'url': attachment.url
                    })
                    logger.info(f"Processing attachment: {attachment.file_type}")

            # Generate response based on context and attachments
            response = await self.generate_contextual_response(
                request.conversation_id,
                current_message,
                attachments
            )

            # Update conversation history with bot response
            self.conversation_history[request.conversation_id].append({
                'role': 'assistant',
                'content': response,
                'timestamp': datetime.now().isoformat()
            })

            # Generate suggested replies
            suggested_replies = await self.generate_suggested_replies(
                request.conversation_id,
                current_message,
                response
            )

            # Yield the response with suggested replies
            yield fp.PartialResponse(
                text=response,
                suggested_replies=suggested_replies
            )

        except Exception as e:
            logger.error(f"Error in get_response: {str(e)}")
            yield fp.PartialResponse(
                text="I apologize, but I encountered an error. Please try again."
            )

    async def generate_contextual_response(
        self,
        conversation_id: str,
        message: str,
        attachments: List[dict]
    ) -> str:
        """Generate a response based on context and attachments."""
        try:
            # Add context awareness
            context = self.get_conversation_context(conversation_id)
            
            # Process attachments if any
            if attachments:
                attachment_context = await self.process_attachments(attachments)
                context += f"\nAttachment context: {attachment_context}"

            # Here you would typically call your AI model
            # For now, we'll return a simple response
            response = f"I understand you're asking about: {message}"
            if context:
                response += f"\nBased on our conversation, I recall: {context}"

            return response

        except Exception as e:
            logger.error(f"Error in generate_contextual_response: {str(e)}")
            return "I apologize, but I couldn't generate a proper response."

    def get_conversation_context(self, conversation_id: str) -> str:
        """Get relevant context from conversation history."""
        if conversation_id not in self.conversation_history:
            return ""

        # Get last 5 messages for context
        recent_messages = self.conversation_history[conversation_id][-5:]
        context = []
        for msg in recent_messages:
            context.append(f"{msg['role']}: {msg['content']}")

        return "\n".join(context)

    async def process_attachments(self, attachments: List[dict]) -> str:
        """Process attachments and extract relevant information."""
        attachment_info = []
        for attachment in attachments:
            attachment_info.append(
                f"Received {attachment['type']} attachment"
            )
        return "; ".join(attachment_info)

    async def generate_suggested_replies(
        self,
        conversation_id: str,
        current_message: str,
        response: str
    ) -> List[str]:
        """Generate contextually relevant suggested replies."""
        try:
            # Simple logic for generating suggested replies
            # In production, you would use more sophisticated methods
            suggestions = [
                "Tell me more about that",
                "Can you explain further?",
                "What are the next steps?"
            ]
            return suggestions[:3]
        except Exception as e:
            logger.error(f"Error generating suggested replies: {str(e)}")
            return []

    async def get_settings(self) -> fp.BotSettings:
        """Return enhanced settings for the bot."""
        return fp.BotSettings(
            name="AIFTW Bot",
            description="A sophisticated AI chatbot platform with advanced capabilities",
            instructions=(
                "This bot provides intelligent responses with context awareness, "
                "attachment processing, and suggested replies. It can help with "
                "various tasks while maintaining conversation context and providing "
                "relevant suggestions."
            ),
            introduction_message=(
                "👋 Hello! I'm AIFTW Bot, your advanced AI assistant. "
                "I can help you with various tasks, process attachments, "
                "and maintain context throughout our conversation. "
                "How can I assist you today?"
            ),
            suggested_replies=True,
            allow_attachments=True,
            suggested_replies_count=3,
            allow_user_context=True,
            allow_files=True
        )

if __name__ == "__main__":
    try:
        # Get the API key from environment variables
        api_key = os.getenv("POE_TOKEN")
        if not api_key:
            raise ValueError("POE_TOKEN environment variable not set")
            
        # Create and run the bot
        bot = AIFTWBot()
        fp.run(bot, access_key=api_key)
    except Exception as e:
        logger.error(f"Failed to start bot: {str(e)}")
